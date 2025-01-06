import {
  CancellationToken,
  CodeAction,
  CodeActionContext,
  CodeActionKind,
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
  SyntaxNode,
  InvertIfBaseProvider,
  DocumentContext,
  Plugin,
} from "vscode-invert-if";
import { service } from "../globals";
import PluginService from "../services/PluginService";
import debounce = require("debounce");

export class InvertIfCodeActionKind {
  private static Condition = CodeActionKind.Refactor.append("condition");
  private static IfElse = CodeActionKind.Refactor.append("ifElse");
  private static GuardClause = CodeActionKind.Refactor.append("guardClause");

  public static InvertCondition = InvertIfCodeActionKind.Condition.append("invert");
  public static InvertIfElse = InvertIfCodeActionKind.IfElse.append("invert");
  public static MergeIfElse = InvertIfCodeActionKind.IfElse.append("merge");
  public static MoveToGuardClause = InvertIfCodeActionKind.GuardClause.append("fromContition");
}

export class InvertIfCodeAction<N extends SyntaxNode<any> | SyntaxNode<any>[] = SyntaxNode<any>> extends CodeAction {
  public range: Range | Selection;
  public context: DocumentContext;
  public node?: N;

  public constructor(title: string, kind: CodeActionKind, context: DocumentContext, range: Range | Selection) {
    super(title, kind);
    this.context = context;
    this.range = range;
  }
}

export default class InvertIfCodeActionProvider implements CodeActionProvider<InvertIfCodeAction>, Disposable {
  public documentSelector: ReadonlyArray<DocumentFilter | string> = [];
  private registered: Disposable | null = null;
  private disposables: Disposable[] = [];

  private static activeCapabilities: (keyof Plugin<any>["capabilities"])[] = [
    "invertCondition",
    "invertIfElse",
    "guardClause",
    "embeddedLanguages",
  ];

  public constructor(plugins: InvertIfBaseProvider) {
    // Debounce the registration of the code action provider to avoid unnecessary cycles
    const register = debounce(() => this.register(), 100);

    this.disposables.push(
      plugins.onRegisterProvider((plugin) => {
        if (!InvertIfCodeActionProvider.activeCapabilities.some((key) => plugin.capabilities[key])) return;

        this.registerPlugin(plugin);

        // Only re-register if we have already registered
        if (this.registered) register();
      }),
      plugins.onUnregisterProvider((plugin) => {
        if (!InvertIfCodeActionProvider.activeCapabilities.some((key) => plugin.capabilities[key])) return;

        this.unregisterPlugin(plugin);

        // Only re-register if we have already registered
        if (this.registered) register();
      })
    );
  }

  public register(provider?: PluginService) {
    if (this.registered) this.registered.dispose();
    if (provider) this.documentSelector = [...provider.getAvailableDocumentSelector()];
    this.registered = languages.registerCodeActionsProvider(this.documentSelector, this);
  }

  public async provideCodeActions(
    document: TextDocument,
    range: Range | Selection,
    context: CodeActionContext,
    token: CancellationToken
  ): Promise<InvertIfCodeAction[]> {
    const { languageId } = document;

    const documentContext = { document, languageId };
    const sections: DocumentContext[] = [{ document, languageId }];
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

  private registerPlugin({ documentSelector }: Plugin<any>) {
    const documentSelectors = documentSelector instanceof Array ? documentSelector : [documentSelector];

    for (const selector of documentSelectors) {
      if (!this.documentSelector.some((compare) => PluginService.compareDocumentSelectors(selector, compare))) {
        this.documentSelector = this.documentSelector.concat(selector);
      }
    }
  }

  private unregisterPlugin({ documentSelector }: Plugin<any>) {
    const documentSelectors = documentSelector instanceof Array ? documentSelector : [documentSelector];

    for (const selector of documentSelectors) {
      this.documentSelector = this.documentSelector.filter((compare) =>
        PluginService.compareDocumentSelectors(selector, compare)
      );
    }
  }

  private async getCodeActions(
    documentContext: DocumentContext,
    range: Range | Selection,
    context: CodeActionContext,
    token: CancellationToken
  ) {
    const { only } = context;
    const capabilities = service.plugins.getAvailableCapabilities(documentContext);
    const codeActions: InvertIfCodeAction[] = [];
    const condition =
      capabilities.invertCondition || capabilities.guardClause
        ? await this.getFirstCondition(documentContext, range, token)
        : null;
    const ifStatements = capabilities.invertIfElse
      ? await this.getIfElseIfStatements(documentContext, range, token)
      : null;
    const ifElseStatement = ifStatements && this.getFirstIfStatement(ifStatements, range);

    if (capabilities.invertCondition) {
      if (!only || only.contains(InvertIfCodeActionKind.InvertCondition)) {
        const codeAction = new InvertIfCodeAction(
          "Invert Condition",
          InvertIfCodeActionKind.InvertCondition,
          documentContext,
          range
        );
        if (condition) codeAction.node = condition;
        codeActions.push(codeAction);
      }
    }
    if (capabilities.invertIfElse) {
      if (!only || only.contains(InvertIfCodeActionKind.InvertIfElse)) {
        const codeAction = new InvertIfCodeAction(
          "Invert If Else",
          InvertIfCodeActionKind.InvertIfElse,
          documentContext,
          range
        );
        if (ifElseStatement) codeAction.node = ifElseStatement;
        codeActions.push(codeAction);
      }
      if (!only || only.contains(InvertIfCodeActionKind.MergeIfElse)) {
        const codeAction = new InvertIfCodeAction<IfStatementRefNode<any>[]>(
          "Merge If Else",
          InvertIfCodeActionKind.MergeIfElse,
          documentContext,
          range
        );
        if (ifStatements) codeAction.node = ifStatements;
        codeActions.push();
      }
    }
    if (capabilities.guardClause) {
      if (!only || only.contains(InvertIfCodeActionKind.MoveToGuardClause)) {
        const codeAction = new InvertIfCodeAction(
          "Move to Guard",
          InvertIfCodeActionKind.MoveToGuardClause,
          documentContext,
          range
        );
        if (condition) codeAction.node = condition;
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
