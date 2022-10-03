import { RefSyntaxNode } from "../nodes/SyntaxNode";

export interface ExpressionContext<T> {
  root: RefSyntaxNode<T>;
  parent: RefSyntaxNode<T>;
}
