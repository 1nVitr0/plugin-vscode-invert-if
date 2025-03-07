import { TextEditorEdit } from "vscode";
import {
  DocumentContext,
  ExpressionContext,
  GeneralStatementUpdatedNode,
  GuardClauseContext,
  GuardClausePosition,
  GuardClauseProvider,
  GuardClauseType,
  IfStatementUpdatedNode,
  RefSyntaxNode,
  SyntaxNodeType,
  UpdatedSyntaxNode,
} from "vscode-invert-if";
import ConditionService from "./ConditionService";
import ConfigurationService from "./ConfigurationService";

export default class GuardClauseService {
  protected static replaceTrueParentStatement: GuardClauseContext[] = [
    GuardClauseContext.WhileStatement,
    GuardClauseContext.DoWhileStatement,
    GuardClauseContext.ForStatement,
  ];

  public constructor(
    protected configurationService: ConfigurationService,
    protected conditionService: ConditionService
  ) {}

  public moveToGuardClause<T>(
    context: DocumentContext,
    edit: TextEditorEdit,
    provider: GuardClauseProvider<T>,
    condition: RefSyntaxNode<T> & ExpressionContext<T>,
    position: GuardClausePosition = GuardClausePosition.Auto,
    type: GuardClauseType = GuardClauseType.Auto
  ) {
    const detectedGuardType: Exclude<GuardClauseType, GuardClauseType.Auto> =
      type == GuardClauseType.Auto ? this.detectGuardClauseType(condition) : type;
    const detectedPosition: Exclude<GuardClausePosition, GuardClausePosition.Auto> =
      position == GuardClausePosition.Auto ? this.detectGuardClausePosition(condition) : position;

    const guardClause = this.getGuardClauseCondition(condition, detectedGuardType);

    if (detectedPosition == GuardClausePosition.Prepend) {
      provider.prependSyntaxNode(context, edit, guardClause, condition.root);
    } else if (detectedPosition == GuardClausePosition.Append) {
      provider.appendSyntaxNode(context, edit, guardClause, condition.root);
    } else {
      provider.insertSyntaxNodeBefore(context, edit, guardClause, condition.parent);
    }

    provider.removeCondition(context, edit, condition);
  }

  public getGuardClauseCondition<T>(
    condition: UpdatedSyntaxNode<T> & ExpressionContext<T>,
    type: Exclude<GuardClauseType, GuardClauseType.Auto>,
    invert = true
  ): IfStatementUpdatedNode<T> {
    const statement = this.getGuardStatement<T>(type);
    const invertedCondition = invert ? this.conditionService.getInverseCondition(condition) : condition;

    return {
      type: SyntaxNodeType.IfStatement,
      test: invertedCondition,
      consequent: statement,
      created: true,
    };
  }

  public detectGuardClauseType<T>(condition: ExpressionContext<T>): Exclude<GuardClauseType, GuardClauseType.Auto> {
    switch (condition.root.type) {
      case SyntaxNodeType.WhileStatement:
      case SyntaxNodeType.DoWhileStatement:
      case SyntaxNodeType.ForStatement:
        return GuardClauseType.Break;
      case SyntaxNodeType.FunctionDeclaration:
      default:
        return GuardClauseType.Return;
    }
  }

  public detectGuardClausePosition<T>(
    condition: ExpressionContext<T>
  ): Exclude<GuardClausePosition, GuardClausePosition.Auto> {
    if (condition.parent.type == SyntaxNodeType.IfStatement) return GuardClausePosition.Keep;

    switch (condition.root.type) {
      case SyntaxNodeType.WhileStatement:
      case SyntaxNodeType.ForStatement:
        return GuardClausePosition.Append;
      case SyntaxNodeType.DoWhileStatement:
        return GuardClausePosition.Prepend;
      case SyntaxNodeType.FunctionDeclaration:
      default:
        return GuardClausePosition.Prepend;
    }
  }

  private getGuardStatement<T>(type: Exclude<GuardClauseType, GuardClauseType.Auto>): GeneralStatementUpdatedNode<T> {
    switch (type) {
      case GuardClauseType.Break:
        return { type: SyntaxNodeType.BreakStatement, created: true };
      case GuardClauseType.Continue:
        return { type: SyntaxNodeType.ContinueStatement, created: true };
      case GuardClauseType.Return:
        return { type: SyntaxNodeType.ReturnStatement, created: true };
    }
  }
}
