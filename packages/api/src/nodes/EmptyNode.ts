import { SyntaxNode, SyntaxNodeType, RefSyntaxNode, UpdatedSyntaxNode } from "./SyntaxNode";

/**
 * Syntax node representing an noop statement. 
 */
export interface EmptyNode<T> extends SyntaxNode<T> {
  type: SyntaxNodeType.Empty;
}

export interface EmptyRefNode<T> extends EmptyNode<T>, RefSyntaxNode<T> {
  type: SyntaxNodeType.Empty;
}

export interface EmptyUpdatedNode<T> extends EmptyNode<T>, UpdatedSyntaxNode<T> {
  type: SyntaxNodeType.Empty;
}

export function isEmptyNode<T>(node: SyntaxNode<T>): node is EmptyNode<T> {
  return node.type === SyntaxNodeType.Empty;
}