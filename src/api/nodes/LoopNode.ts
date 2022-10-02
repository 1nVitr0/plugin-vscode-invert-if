import { SyntaxNode, SyntaxNodeType, RefSyntaxNode, UpdatedSyntaxNode } from "./SyntaxNode";

export interface ForStatementNode<T, S extends SyntaxNode<T> = SyntaxNode<T>> extends SyntaxNode<T> {
  type: SyntaxNodeType.ForStatement;
  test: S;
}

export interface ForStatementRefNode<T> extends ForStatementNode<T, RefSyntaxNode<T>>, RefSyntaxNode<T> {
  type: SyntaxNodeType.ForStatement;
}

export interface ForStatementUpdatedNode<T> extends ForStatementNode<T, UpdatedSyntaxNode<T>>, UpdatedSyntaxNode<T> {
  type: SyntaxNodeType.ForStatement;
}

export interface WhileStatementNode<T, S extends SyntaxNode<T> = SyntaxNode<T>> extends SyntaxNode<T> {
  type: SyntaxNodeType.WhileStatement;
  test: S;
}

export interface WhileStatementRefNode<T> extends WhileStatementNode<T, RefSyntaxNode<T>>, RefSyntaxNode<T> {
  type: SyntaxNodeType.WhileStatement;
}

export interface WhileStatementUpdatedNode<T>
  extends WhileStatementNode<T, UpdatedSyntaxNode<T>>,
    UpdatedSyntaxNode<T> {
  type: SyntaxNodeType.WhileStatement;
}

export interface DoWhileStatementNode<T, S extends SyntaxNode<T> = SyntaxNode<T>> extends SyntaxNode<T> {
  type: SyntaxNodeType.DoWhileStatement;
  test: S;
}

export interface DoWhileStatementRefNode<T> extends DoWhileStatementNode<T, RefSyntaxNode<T>>, RefSyntaxNode<T> {
  type: SyntaxNodeType.DoWhileStatement;
}

export interface DoWhileStatementUpdatedNode<T>
  extends DoWhileStatementNode<T, UpdatedSyntaxNode<T>>,
    UpdatedSyntaxNode<T> {
  type: SyntaxNodeType.DoWhileStatement;
}

export type LoopNode<T> = ForStatementNode<T> | WhileStatementNode<T> | DoWhileStatementNode<T>;

export type LoopRefNode<T> = ForStatementRefNode<T> | WhileStatementRefNode<T> | DoWhileStatementRefNode<T>;

export type LoopUpdatedNode<T> =
  | ForStatementUpdatedNode<T>
  | WhileStatementUpdatedNode<T>
  | DoWhileStatementUpdatedNode<T>;

export function isLoopNode<T>(node: SyntaxNode<T>): node is LoopNode<T> {
  return (
    node.type === SyntaxNodeType.ForStatement ||
    node.type === SyntaxNodeType.WhileStatement ||
    node.type === SyntaxNodeType.DoWhileStatement
  );
}

export function isWhileNode<T>(node: SyntaxNode<T>): node is WhileStatementNode<T> {
  return node.type === SyntaxNodeType.WhileStatement;
}

export function isDoWhileNode<T>(node: SyntaxNode<T>): node is DoWhileStatementNode<T> {
  return node.type === SyntaxNodeType.DoWhileStatement;
}

export function isForNode<T>(node: SyntaxNode<T>): node is ForStatementNode<T> {
  return node.type === SyntaxNodeType.ForStatement;
}