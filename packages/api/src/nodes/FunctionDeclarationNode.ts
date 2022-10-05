import { SyntaxNode, SyntaxNodeType, RefSyntaxNode, UpdatedSyntaxNode } from "./SyntaxNode";

/**
 * Syntax node representing a function declaration.
 */
export interface FunctionDeclarationNode<T> extends SyntaxNode<T> {
  type: SyntaxNodeType.FunctionDeclaration;
}

export interface FunctionDeclarationRefNode<T> extends FunctionDeclarationNode<T>, RefSyntaxNode<T> {
  type: SyntaxNodeType.FunctionDeclaration;
}

export interface FunctionDeclarationUpdatedNode<T> extends FunctionDeclarationNode<T>, UpdatedSyntaxNode<T> {
  type: SyntaxNodeType.FunctionDeclaration;
}

export function isFunctionDeclarationNode<T>(node: SyntaxNode<T>): node is FunctionDeclarationNode<T> {
  return node.type === SyntaxNodeType.FunctionDeclaration;
}