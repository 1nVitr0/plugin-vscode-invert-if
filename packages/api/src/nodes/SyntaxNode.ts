import { Range } from "vscode";

export enum SyntaxNodeType {
  Group,
  UnaryExpression,
  BinaryExpression,
  LogicalExpression,
  FunctionDeclaration,
  DoWhileStatement,
  ForStatement,
  IfStatement,
  WhileStatement,
  ReturnStatement,
  BreakStatement,
  ContinueStatement,
  Empty,
  Generic,
}

export interface SyntaxNode<T> {
  type: SyntaxNodeType;
  name?: string;
}

export interface RefSyntaxNode<T> extends SyntaxNode<T> {
  range: Range;
  description?: string;
  ref: T;
}

export interface UpdatedSyntaxNode<T> extends Partial<RefSyntaxNode<T>> {
  type: SyntaxNodeType;
  changed?: true;
  removed?: true;
  created?: true;
}

export function isRefNode(node: SyntaxNode<any>): node is RefSyntaxNode<any> {
  return (node as RefSyntaxNode<any>).ref !== undefined;
}
