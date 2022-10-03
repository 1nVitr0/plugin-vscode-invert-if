import { SyntaxNode, SyntaxNodeType, RefSyntaxNode, UpdatedSyntaxNode } from "./SyntaxNode";

export interface GenericNode<T> extends SyntaxNode<T> {
  type: SyntaxNodeType.Generic;
}

export interface GenericRefNode<T> extends GenericNode<T>, RefSyntaxNode<T> {
  type: SyntaxNodeType.Generic;
}

export interface GenericUpdatedNode<T> extends GenericNode<T>, UpdatedSyntaxNode<T> {
  type: SyntaxNodeType.Generic;
}

export function isGenericNode<T>(node: SyntaxNode<T>): node is GenericNode<T> {
  return node.type === SyntaxNodeType.Generic;
}
