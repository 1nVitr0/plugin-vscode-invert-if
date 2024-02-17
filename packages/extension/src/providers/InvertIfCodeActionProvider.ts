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
  public document: TextDocument;
  public node?: N;

  public constructor(title: string, kind: CodeActionKind, document: TextDocument, range: Range | Selection) {
    super(title, kind);
    this.document = document;
    this.range = range;
  }
}

export default class InvertIfCodeActionProvider implements CodeActionProvider<InvertIfCodeAction>, Disposable {
  public documentSelector: ReadonlyArray<DocumentFilter | string> = [];
  private registered: Disposable | null = null;
  private disposables: Disposable[] = [];

  public constructor(plugins: InvertIfBaseProvider) {
    // Debounce the registration of the code action provider to avoid unnecessary cycles
    const register = debounce(() => this.register(), 100);

    this.disposables.push(
      plugins.onRegisterProvider((provider) => {
        if (provider.documentSelector instanceof Array) {
          this.documentSelector = this.documentSelector.concat(provider.documentSelector);
        } else {
          this.documentSelector = this.documentSelector.concat([provider.documentSelector]);
        }

        // Only re-register if we have already registered
        if (this.registered) register();
      }),
      plugins.onUnregisterProvider((provider) => {
        if (provider.documentSelector instanceof Array) {
          this.documentSelector = this.documentSelector.filter(
            (selector) => !(provider.documentSelector as ReadonlyArray<DocumentFilter | string>).includes(selector)
          );
        } else {
          this.documentSelector = this.documentSelector.filter((selector) => selector !== provider.documentSelector);
        }

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
    const { only } = context;
    const capabilities = service.plugins.getAvailableCapabilities(document);
    const codeActions: InvertIfCodeAction[] = [];
    const condition =
      capabilities.invertCondition || capabilities.guardClause
        ? await this.getFirstCondition(document, range, token)
        : null;
    const ifStatements = capabilities.invertIfElse ? await this.getIfElseIfStatements(document, range, token) : null;
    const ifElseStatement = ifStatements && this.getFirstIfStatement(ifStatements, range);

    if (capabilities.invertCondition) {
      if (!only || only.contains(InvertIfCodeActionKind.InvertCondition)) {
        const codeAction = new InvertIfCodeAction(
          "Invert Condition",
          InvertIfCodeActionKind.InvertCondition,
          document,
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
          document,
          range
        );
        if (ifElseStatement) codeAction.node = ifElseStatement;
        codeActions.push(codeAction);
      }
      if (!only || only.contains(InvertIfCodeActionKind.MergeIfElse)) {
        const codeAction = new InvertIfCodeAction<IfStatementRefNode<any>[]>(
          "Merge If Else",
          InvertIfCodeActionKind.MergeIfElse,
          document,
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
          document,
          range
        );
        if (condition) codeAction.node = condition;
        codeActions.push(codeAction);
      }
    }

    return codeActions;
  }

  public async resolveCodeAction(
    codeAction: InvertIfCodeAction,
    token: CancellationToken
  ): Promise<InvertIfCodeAction> {
    const { document, range, kind } = codeAction;
    const edit = new WorkspaceEdit();
    const textEdit: TextEditorEdit = {
      insert: (position, value) => edit.insert(document.uri, position, value),
      replace: (range: Range | Selection, value) => edit.replace(document.uri, range, value),
      delete: (range) => edit.delete(document.uri, range),
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
      return await this.editInvertIfElse(codeAction, textEdit, token);
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

  private async getFirstCondition(
    document: TextDocument,
    range: Range | Selection,
    token: CancellationToken
  ): Promise<RefSyntaxNode<any> | null> {
    const provider = service.plugins.getInvertConditionProvider(document)!;
    const conditions = await provider.provideConditions(document, range);

    return (conditions && service.condition.sortConditionsByRangeMatch(conditions, range).shift()) ?? null;
  }

  private async getIfElseIfStatements(
    document: TextDocument,
    range: Range | Selection,
    token: CancellationToken
  ): Promise<IfStatementRefNode<any>[] | null> {
    const provider = service.plugins.getInvertIfElseProvider(document)!;
    const statements = await provider.provideIfStatements(document, range);

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
    const { document, range } = codeAction;

    const provider = service.plugins.getInvertConditionProvider(document)!;
    const conditions = await provider.provideConditions(document, range);
    const condition = conditions && service.condition.sortConditionsByRangeMatch(conditions, range).shift();

    if (!condition || token.isCancellationRequested) return codeAction;

    const resolvedCondition = {
      ...condition,
      ...(await provider.resolveCondition?.(condition)),
    };

    service.condition.inverseCondition(document, edit, provider, resolvedCondition);

    return codeAction;
  }

  private async editInvertIfElse(
    codeAction: InvertIfCodeAction,
    edit: TextEditorEdit,
    token: CancellationToken
  ): Promise<InvertIfCodeAction> {
    const { document, range } = codeAction;
    const provider = service.plugins.getInvertIfElseProvider(document)!;
    const statements = await provider.provideIfStatements(document, range);
    const statement = statements && service.ifElse.sortIfStatementsByRangeMatch(statements, range).shift();

    if (!statement || token.isCancellationRequested) return codeAction;

    const resolvedStatement = {
      ...statement,
      ...(await provider.resolveIfStatement?.(statement)),
    };

    service.ifElse.inverseIfElse(document, edit, provider, resolvedStatement);

    return codeAction;
  }

  private async editMergeIfElse(
    codeAction: InvertIfCodeAction,
    edit: TextEditorEdit,
    token: CancellationToken
  ): Promise<InvertIfCodeAction> {
    const { document, range } = codeAction;
    const provider = service.plugins.getInvertIfElseProvider(document)!;
    const statements = (await provider.provideIfStatements(document, range))?.sort((a, b) =>
      a.range.start.compareTo(b.range.start)
    );
    const parent = statements?.shift();

    if (parent && !token.isCancellationRequested)
      service.ifElse.mergeNestedIfs(document, edit, provider, parent, ...statements!);

    return codeAction;
  }

  private async editMoveToGuard(
    codeAction: InvertIfCodeAction,
    edit: TextEditorEdit,
    token: CancellationToken
  ): Promise<InvertIfCodeAction> {
    const { document, range } = codeAction;
    const provider = service.plugins.getGuardClauseProvider(document)!;
    const conditions = await provider.provideConditions(document, range);
    const condition = conditions && service.condition.sortConditionsByRangeMatch(conditions, range).shift();

    if (!condition || token.isCancellationRequested) return codeAction;

    const resolvedCondition = {
      ...condition,
      ...(await provider.resolveCondition?.(condition)),
    };

    service.guardClause.moveToGuardClause(
      document,
      edit,
      provider,
      resolvedCondition,
      GuardClausePosition.Auto,
      GuardClauseType.Auto
    );

    return codeAction;
  }
}
