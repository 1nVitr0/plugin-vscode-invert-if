import { Range, TextDocument, TextEditorEdit } from "vscode";
import {
  BinaryExpressionUpdatedNode,
  BinaryOperator,
  ConditionRefNode,
  ConditionUpdatedNode,
  InvertConditionProvider,
  isBinaryExpressionNode,
  isConditionNode,
  isLogicalExpressionNode,
  isUnaryExpressionNode,
  LogicalExpressionSyntaxNode,
  LogicalOperator,
  RefSyntaxNode,
  SyntaxNodeType,
  UnaryExpressionRefNode,
  UnaryExpressionUpdatedNode,
  UnaryOperator,
  UpdatedSyntaxNode,
} from "vscode-invert-if";
import ConfigurationService from "./ConfigurationService";

export default class ConditionService {
  public static inverseLogicalOperator: Record<LogicalOperator, LogicalOperator> = {
    [LogicalOperator.And]: LogicalOperator.Or,
    [LogicalOperator.Or]: LogicalOperator.And,
    [LogicalOperator.NullishCoalescing]: LogicalOperator.And,
  };
  public static inverseBinaryOperator: Record<BinaryOperator, BinaryOperator> = {
    [BinaryOperator.Equal]: BinaryOperator.NotEqual,
    [BinaryOperator.StrictEqual]: BinaryOperator.StrictNotEqual,
    [BinaryOperator.NotEqual]: BinaryOperator.Equal,
    [BinaryOperator.StrictNotEqual]: BinaryOperator.StrictEqual,
    [BinaryOperator.LessThan]: BinaryOperator.GreaterThanOrEqual,
    [BinaryOperator.LessThanOrEqual]: BinaryOperator.GreaterThan,
    [BinaryOperator.GreaterThan]: BinaryOperator.LessThanOrEqual,
    [BinaryOperator.GreaterThanOrEqual]: BinaryOperator.LessThan,
  };
  public static inverseUnaryOperator: Partial<Record<UnaryOperator, UnaryOperator | null>> = {
    [UnaryOperator.Not]: null,
  };

  public constructor(private configurationService: ConfigurationService) {}

  public inverseCondition<T>(
    document: TextDocument,
    edit: TextEditorEdit,
    provider: InvertConditionProvider<T>,
    condition: RefSyntaxNode<T>,
    depth = this.configurationService.inversionDepth
  ) {
    const inverse = this.getInverseCondition(condition, depth);
    provider.replaceCondition(document, edit, condition, inverse);
  }

  public getInverseCondition<T>(
    condition: UpdatedSyntaxNode<T>,
    depth = this.configurationService.inversionDepth
  ): UpdatedSyntaxNode<T> {
    if (depth == 0) return this.getInverseGroup(condition);

    switch (condition.type) {
      case SyntaxNodeType.UnaryExpression:
        return this.getInverseGroup(condition);
      case SyntaxNodeType.LogicalExpression:
        const { left, right, operator: logicalOperator } = condition as LogicalExpressionSyntaxNode<T>;
        const inverseLogical = ConditionService.inverseLogicalOperator[logicalOperator];
        return {
          ...condition,
          operator: inverseLogical,
          left: isConditionNode(left)
            ? this.getInverseCondition(left as ConditionRefNode<T>, depth - 1)
            : this.getInverseGroup(left),
          right: isConditionNode(right)
            ? this.getInverseCondition(right as ConditionRefNode<T>, depth - 1)
            : this.getInverseGroup(right),
          changed: true,
        } as ConditionUpdatedNode<T>;
      case SyntaxNodeType.BinaryExpression:
        const { operator: binaryOperator } = condition as BinaryExpressionUpdatedNode<T>;
        const inverseBinary = ConditionService.inverseBinaryOperator[binaryOperator];
        if (!inverseBinary) return this.getInverseGroup(condition);
        return {
          ...condition,
          operator: inverseBinary,
          changed: true,
        } as BinaryExpressionUpdatedNode<T>;
      default:
        return this.getInverseGroup(condition);
    }
  }

  public getInverseGroup<T>(condition: UpdatedSyntaxNode<T>): UpdatedSyntaxNode<T> {
    if (!isUnaryExpressionNode(condition)) {
      return {
        ...condition,
        ...this.getUnaryCondition(UnaryOperator.Not, condition),
        changed: true,
      };
    }

    const { operator, argument } = condition as UnaryExpressionRefNode<T>;

    const inverse = ConditionService.inverseUnaryOperator[operator];
    if (inverse) return { ...condition, ...this.getUnaryCondition(inverse, argument), changed: true };
    else if (inverse === null) return { ...argument, changed: true };
    else return { ...this.getUnaryCondition(UnaryOperator.Not, condition), created: true };
  }

  public chainConditions<T>(operator: LogicalOperator, ...conditions: UpdatedSyntaxNode<T>[]): UpdatedSyntaxNode<T> {
    let result = conditions.shift();
    if (!result) throw new Error("No conditions to chain");

    let previous: UpdatedSyntaxNode<T> | undefined;
    while ((previous = conditions.shift())) {
      result = {
        type: SyntaxNodeType.LogicalExpression,
        operator,
        left: result,
        right: previous,
      } as LogicalExpressionSyntaxNode<T>;
    }

    return result;
  }

  public getConditionName<T>(condition: UpdatedSyntaxNode<T>): string {
    if (condition.name && !condition.changed && !condition.removed) {
      return condition.name;
    }

    if (isBinaryExpressionNode(condition) || isLogicalExpressionNode(condition)) {
      return `${this.getConditionName(condition.left)} ${condition.operator} ${this.getConditionName(condition.right)}`;
    } else if (isUnaryExpressionNode(condition)) {
      return `${condition.operator} ${this.getConditionName(condition.argument)}`;
    } else return `${SyntaxNodeType[condition.type]}`;
  }

  public sortConditionsByRangeMatch<T, N extends RefSyntaxNode<T>>(conditions: N[], range: Range): N[] {
    return conditions.sort((a, b) => {
      const aRange = a.range;
      const bRange = b.range;
      const aIntersect = aRange.intersection(range);
      const bIntersect = bRange.intersection(range);

      if (aIntersect ? !bIntersect : bIntersect) return aIntersect ? 1 : -1;

      const diff =
        aIntersect && bIntersect
          ? aIntersect.end.compareTo(bIntersect.end) - aIntersect.start.compareTo(bIntersect.start)
          : 0;
      return diff == 0 ? aRange.end.compareTo(bRange.end) - aRange.start.compareTo(bRange.start) : diff;
    });
  }

  private getUnaryCondition<T>(operator: UnaryOperator, content: UpdatedSyntaxNode<T>): UnaryExpressionUpdatedNode<T> {
    return {
      type: SyntaxNodeType.UnaryExpression,
      operator,
      argument: content,
    };
  }
}
