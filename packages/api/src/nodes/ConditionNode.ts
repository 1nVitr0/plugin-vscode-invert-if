import { RefSyntaxNode, SyntaxNode, SyntaxNodeType, UpdatedSyntaxNode } from "./SyntaxNode";

/**
 * Operator used in logical expressions.
 */
export enum LogicalOperator {
  And = "&&",
  Or = "||",
  NullishCoalescing = "??",
}

/**
 * Operator used in binary expressions.
 */
export enum BinaryOperator {
  Equal = "==",
  StrictEqual = "===",
  NotEqual = "!=",
  StrictNotEqual = "!==",
  LessThan = "<",
  LessThanOrEqual = "<=",
  GreaterThan = ">",
  GreaterThanOrEqual = ">=",
}

/**
 * Operator used in unary expressions.
 */
export enum UnaryOperator {
  Not = "!",
  Negative = "-",
  Positive = "+",
}

/**
 * Syntax node representing a unary expression.
 */
export interface UnaryExpressionSyntaxNode<T, S extends SyntaxNode<T> = SyntaxNode<T>> extends SyntaxNode<T> {
  type: SyntaxNodeType.UnaryExpression;
  /**
   * The operator of the unary expression.
   */
  operator: UnaryOperator;
  /**
   * The argument of the unary expression.
   */
  argument: S;
}

export interface UnaryExpressionRefNode<T> extends UnaryExpressionSyntaxNode<T, RefSyntaxNode<T>>, RefSyntaxNode<T> {
  type: SyntaxNodeType.UnaryExpression;
}

export interface UnaryExpressionUpdatedNode<T>
  extends UnaryExpressionSyntaxNode<T, UpdatedSyntaxNode<T>>,
    UpdatedSyntaxNode<T> {
  type: SyntaxNodeType.UnaryExpression;
}

/**
 * Syntax node representing a binary expression.
 */
export interface BinaryExpressionSyntaxNode<T, S extends SyntaxNode<T> = SyntaxNode<T>> extends SyntaxNode<T> {
  type: SyntaxNodeType.BinaryExpression;
  /**
   * The operator of the binary expression.
   */
  operator: BinaryOperator;
  /**
   * The left argument of the binary expression.
   */
  left: S;
  /**
   * The right argument of the binary expression.
   */
  right: S;
}

export interface BinaryExpressionRefNode<T> extends BinaryExpressionSyntaxNode<T, RefSyntaxNode<T>>, RefSyntaxNode<T> {
  type: SyntaxNodeType.BinaryExpression;
}

export interface BinaryExpressionUpdatedNode<T>
  extends BinaryExpressionSyntaxNode<T, UpdatedSyntaxNode<T>>,
    UpdatedSyntaxNode<T> {
  type: SyntaxNodeType.BinaryExpression;
}

/**
 * Syntax node representing a logical expression.
 */
export interface LogicalExpressionSyntaxNode<T, S extends SyntaxNode<T> = SyntaxNode<T>> extends SyntaxNode<T> {
  type: SyntaxNodeType.LogicalExpression;
  /**
   * The operator of the logical expression.
   */
  operator: LogicalOperator;
  /**
   * The left argument of the logical expression.
   */
  left: S;
  /**
   * The right argument of the logical expression.
   */
  right: S;
}

export interface LogicalExpressionRefNode<T>
  extends LogicalExpressionSyntaxNode<T, RefSyntaxNode<T>>,
    RefSyntaxNode<T> {
  type: SyntaxNodeType.LogicalExpression;
}

export interface LogicalExpressionUpdatedNode<T>
  extends LogicalExpressionSyntaxNode<T, UpdatedSyntaxNode<T>>,
    UpdatedSyntaxNode<T> {
  type: SyntaxNodeType.LogicalExpression;
}

/**
 * Syntax node representing a conditional expression.
 */
export type ConditionSyntaxNode<T> =
  | UnaryExpressionSyntaxNode<T>
  | BinaryExpressionSyntaxNode<T>
  | LogicalExpressionSyntaxNode<T>;

export type ConditionRefNode<T> = UnaryExpressionRefNode<T> | BinaryExpressionRefNode<T> | LogicalExpressionRefNode<T>;

export type ConditionUpdatedNode<T> =
  | UnaryExpressionUpdatedNode<T>
  | BinaryExpressionUpdatedNode<T>
  | LogicalExpressionUpdatedNode<T>;

export function isConditionNode<T>(node: SyntaxNode<T>): node is ConditionSyntaxNode<T> {
  return (
    node.type === SyntaxNodeType.UnaryExpression ||
    node.type === SyntaxNodeType.BinaryExpression ||
    node.type === SyntaxNodeType.LogicalExpression
  );
}

export function isUnaryExpressionNode<T>(node: SyntaxNode<T>): node is UnaryExpressionSyntaxNode<T> {
  return node.type === SyntaxNodeType.UnaryExpression;
}

export function isBinaryExpressionNode<T>(node: SyntaxNode<T>): node is BinaryExpressionSyntaxNode<T> {
  return node.type === SyntaxNodeType.BinaryExpression;
}

export function isLogicalExpressionNode<T>(node: SyntaxNode<T>): node is LogicalExpressionSyntaxNode<T> {
  return node.type === SyntaxNodeType.LogicalExpression;
}
