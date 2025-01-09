import {
  CancellationToken,
  CodeActionContext,
  CodeActionProvider,
  Disposable,
  DocumentFilter,
  languages,
  Range,
  Selection,
  TextDocument,
  TextEditorEdit,
  WorkspaceEdit,
} from "vscode";
import {
  GuardClausePosition,
  GuardClauseType,
  IfStatementRefNode,
  RefSyntaxNode,
  DocumentContext,
  Plugin,
  rangeToLocal,
} from "vscode-invert-if";
import { service } from "../globals";
import PluginService from "../services/PluginService";
import debounce = require("debounce");
import { InvertIfCodeAction } from "../types/InvertIfCodeAction";
import { InvertIfCodeActionKind } from "../types/InvertIfCodeActionKind";

export default class InvertIfCodeActionProvider implements CodeActionProvider<InvertIfCodeAction>, Disposable {
  public documentSelector: ReadonlyArray<DocumentFilter | string> = [];
  private registered: Disposable | null = null;
  private disposables: Disposable[] = [];

  private static actionablePluginCapabilities: (keyof Plugin<any>["capabilities"])[] = [
    "invertCondition",
    "invertIfElse",
    "guardClause",
    "embeddedLanguages",
  ];

  public constructor(plugins: PluginService) {
    // Debounce the registration of the code action provider to avoid unnecessary cycles
    const register = debounce(() => this.register(), 500);

    this.disposables.push(
      plugins.onRegisterProvider((plugin) => {
        if (!InvertIfCodeActionProvider.actionablePluginCapabilities.some((key) => plugin.capabilities[key])) return;

        this.updateDocumentSelector(plugins);
        // Only re-register if we have already registered
        if (this.registered) register();
      }),
      plugins.onUnregisterProvider((plugin) => {
        if (!InvertIfCodeActionProvider.actionablePluginCapabilities.some((key) => plugin.capabilities[key])) return;

        this.updateDocumentSelector(plugins);
        // Only re-register if we have already registered
        if (this.registered) register();
      })
    );
  }

  public register(provider?: PluginService) {
    if (provider) this.updateDocumentSelector(provider);
    if (this.registered) this.registered.dispose();
    this.registered = this.documentSelector.length
      ? languages.registerCodeActionsProvider(this.documentSelector, this)
      : new Disposable(() => {
          /* Register dummy when no plugins are active  */
        });
  }

  public async provideCodeActions(
    document: TextDocument,
    range: Range | Selection,
    context: CodeActionContext,
    token: CancellationToken
  ): Promise<InvertIfCodeAction[]> {
    const { languageId } = document;

    const documentContext = { document, languageId };
    const sections: DocumentContext[] = [documentContext];
    const embedProvider = service.plugins.getEmbeddedLanguageProvider(document);

    if (embedProvider) {
      const originalLanguageId = languageId;
      const embeddedSections = (await service.embedded.getEmbeddedSections(documentContext, embedProvider)) ?? [];
      sections.push(
        ...embeddedSections.map<DocumentContext>(({ range, languageId }) => ({
          document,
          languageId,
          embeddedRange: range,
          originalLanguageId,
        }))
      );
    }

    return (
      await Promise.all(sections.map((documentContext) => this.getCodeActions(documentContext, range, context, token)))
    ).flat(1);
  }

  public async resolveCodeAction(
    codeAction: InvertIfCodeAction,
    token: CancellationToken
  ): Promise<InvertIfCodeAction> {
    const {
      context: {
        document: { uri },
      },
      kind,
    } = codeAction;

    const edit = new WorkspaceEdit();
    const textEdit: TextEditorEdit = {
      insert: (position, value) => edit.insert(uri, position, value),
      replace: (range: Range | Selection, value) => edit.replace(uri, range, value),
      delete: (range) => edit.delete(uri, range),
      setEndOfLine: () => {},
    };

    if (kind === InvertIfCodeActionKind.InvertCondition) {
      codeAction.edit = edit;
      return await this.editInvertCondition(codeAction, textEdit, token);
    } else if (kind === InvertIfCodeActionKind.InvertIfElse) {
      codeAction.edit = edit;
      return await this.editInvertIfElse(codeAction, textEdit, token);
    } else if (kind === InvertIfCodeActionKind.MergeIfElse) {
      codeAction.edit = edit;
      return await this.editMergeIfElse(codeAction, textEdit, token);
    } else if (kind === InvertIfCodeActionKind.MoveToGuardClause) {
      codeAction.edit = edit;
      return await this.editMoveToGuard(codeAction, textEdit, token);
    }

    return codeAction;
  }

  public dispose() {
    if (this.registered) {
      this.registered.dispose();
      this.registered = null;
    }

    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }

  private updateDocumentSelector(plugins: PluginService) {
    this.documentSelector = plugins.getAvailableDocumentSelector(
      InvertIfCodeActionProvider.actionablePluginCapabilities
    );
  }

  private async getCodeActions(
    documentContext: DocumentContext,
    range: Range | Selection,
    context: CodeActionContext,
    token: CancellationToken
  ) {
    const { only } = context;
    const localRange = rangeToLocal(range, documentContext);
    const capabilities = service.plugins.getAvailableCapabilities(documentContext);
    const codeActions: InvertIfCodeAction[] = [];

    const mainCondition =
      capabilities.invertCondition || capabilities.guardClause
        ? await this.getFirstCondition(documentContext, localRange, token)
        : null;
    const mainIfStatements = capabilities.invertIfElse
      ? await this.getIfElseIfStatements(documentContext, localRange, token)
      : null;
    const mainIfElseStatement = mainIfStatements && this.getFirstIfStatement(mainIfStatements, localRange);
    const mainConditionInRange = mainCondition?.range.contains(localRange);
    const mainIfElseInRange = mainIfElseStatement?.range.contains(localRange);

    if (capabilities.invertCondition && mainConditionInRange) {
      if (!only || only.contains(InvertIfCodeActionKind.InvertCondition)) {
        const codeAction = new InvertIfCodeAction(
          "Invert Condition",
          InvertIfCodeActionKind.InvertCondition,
          documentContext,
          localRange
        );
        if (mainCondition) codeAction.node = mainCondition;
        codeActions.push(codeAction);
      }
    }
    if (capabilities.invertIfElse && mainIfElseInRange) {
      if (!only || only.contains(InvertIfCodeActionKind.InvertIfElse)) {
        const codeAction = new InvertIfCodeAction(
          "Invert If Else",
          InvertIfCodeActionKind.InvertIfElse,
          documentContext,
          localRange
        );
        if (mainIfElseStatement) codeAction.node = mainIfElseStatement;
        codeActions.push(codeAction);
      }
      if ((!only || only.contains(InvertIfCodeActionKind.MergeIfElse)) && (mainIfStatements?.length || 0) > 1) {
        const codeAction = new InvertIfCodeAction<IfStatementRefNode<any>[]>(
          "Merge If Else",
          InvertIfCodeActionKind.MergeIfElse,
          documentContext,
          localRange
        );
        if (mainIfStatements) codeAction.node = mainIfStatements;
        codeActions.push();
      }
    }
    if (capabilities.guardClause && mainConditionInRange) {
      if (!only || only.contains(InvertIfCodeActionKind.MoveToGuardClause)) {
        const codeAction = new InvertIfCodeAction(
          "Move to Guard",
          InvertIfCodeActionKind.MoveToGuardClause,
          documentContext,
          localRange
        );
        if (mainCondition) codeAction.node = mainCondition;
        codeActions.push(codeAction);
      }
    }

    return codeActions;
  }

  private async getFirstCondition(
    context: DocumentContext,
    range: Range | Selection,
    token: CancellationToken
  ): Promise<RefSyntaxNode<any> | null> {
    const provider = service.plugins.getInvertConditionProvider(context)!;
    const conditions = await provider.provideConditions(context, range);

    return (conditions && service.condition.sortConditionsByRangeMatch(conditions, range).shift()) ?? null;
  }

  private async getIfElseIfStatements(
    context: DocumentContext,
    range: Range | Selection,
    token: CancellationToken
  ): Promise<IfStatementRefNode<any>[] | null> {
    const provider = service.plugins.getInvertIfElseProvider(context)!;
    const statements = await provider.provideIfStatements(context, range);

    return statements?.sort((a, b) => a.range.start.compareTo(b.range.start)) ?? null;
  }

  private getFirstIfStatement(
    statements: IfStatementRefNode<any>[],
    range: Range | Selection
  ): IfStatementRefNode<any> | null {
    return service.ifElse.sortIfStatementsByRangeMatch(statements, range).shift() ?? null;
  }

  private async editInvertCondition(
    codeAction: InvertIfCodeAction,
    edit: TextEditorEdit,
    token: CancellationToken
  ): Promise<InvertIfCodeAction> {
    const { context, range } = codeAction;

    const provider = service.plugins.getInvertConditionProvider(context)!;
    const conditions = await provider.provideConditions(context, range);
    const condition = conditions && service.condition.sortConditionsByRangeMatch(conditions, range).shift();

    if (!condition || token.isCancellationRequested) return codeAction;

    const resolvedCondition = {
      ...condition,
      ...(await provider.resolveCondition?.(context, condition)),
    };

    service.condition.inverseCondition(context, edit, provider, resolvedCondition);

    return codeAction;
  }

  private async editInvertIfElse(
    codeAction: InvertIfCodeAction,
    edit: TextEditorEdit,
    token: CancellationToken
  ): Promise<InvertIfCodeAction> {
    const { context, range } = codeAction;
    const provider = service.plugins.getInvertIfElseProvider(context)!;
    const statements = await provider.provideIfStatements(context, range);
    const statement = statements && service.ifElse.sortIfStatementsByRangeMatch(statements, range).shift();

    if (!statement || token.isCancellationRequested) return codeAction;

    const resolvedStatement = {
      ...statement,
      ...(await provider.resolveIfStatement?.(context, statement)),
    };

    service.ifElse.inverseIfElse(context, edit, provider, resolvedStatement);

    return codeAction;
  }

  private async editMergeIfElse(
    codeAction: InvertIfCodeAction,
    edit: TextEditorEdit,
    token: CancellationToken
  ): Promise<InvertIfCodeAction> {
    const { context, range } = codeAction;
    const provider = service.plugins.getInvertIfElseProvider(context)!;
    const statements = (await provider.provideIfStatements(context, range))?.sort((a, b) =>
      a.range.start.compareTo(b.range.start)
    );
    const parent = statements?.shift();

    if (parent && !token.isCancellationRequested)
      service.ifElse.mergeNestedIfs(context, edit, provider, parent, ...statements!);

    return codeAction;
  }

  private async editMoveToGuard(
    codeAction: InvertIfCodeAction,
    edit: TextEditorEdit,
    token: CancellationToken
  ): Promise<InvertIfCodeAction> {
    const { context, range } = codeAction;
    const provider = service.plugins.getGuardClauseProvider(context)!;
    const conditions = await provider.provideConditions(context, range);
    const condition = conditions && service.condition.sortConditionsByRangeMatch(conditions, range).shift();

    if (!condition || token.isCancellationRequested) return codeAction;

    const resolvedCondition = {
      ...condition,
      ...(await provider.resolveCondition?.(context, condition)),
    };

    service.guardClause.moveToGuardClause(
      context,
      edit,
      provider,
      resolvedCondition,
      GuardClausePosition.Auto,
      GuardClauseType.Auto
    );

    return codeAction;
  }
}
