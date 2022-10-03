import { RefSyntaxNode, SyntaxNode, SyntaxNodeType, UpdatedSyntaxNode } from "./SyntaxNode";

export enum LogicalOperator {
  And = "&&",
  Or = "||",
  NullishCoalescing = "??",
}

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

export enum UnaryOperator {
  Not = "!",
  Negative = "-",
  Positive = "+",
}

export interface UnaryExpressionSyntaxNode<T, S extends SyntaxNode<T> = SyntaxNode<T>> extends SyntaxNode<T> {
  type: SyntaxNodeType.UnaryExpression;
  operator: UnaryOperator;
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

export interface BinaryExpressionSyntaxNode<T, S extends SyntaxNode<T> = SyntaxNode<T>> extends SyntaxNode<T> {
  type: SyntaxNodeType.BinaryExpression;
  operator: BinaryOperator;
  left: S;
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

export interface LogicalExpressionSyntaxNode<T, S extends SyntaxNode<T> = SyntaxNode<T>> extends SyntaxNode<T> {
  type: SyntaxNodeType.LogicalExpression;
  operator: LogicalOperator;
  left: S;
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
