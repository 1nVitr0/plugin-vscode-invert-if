import { SyntaxNode, SyntaxNodeType, RefSyntaxNode, UpdatedSyntaxNode } from "./SyntaxNode";

/**
 * Syntax node representing an if statement.
 */
export interface IfStatementSyntaxNode<T, S extends SyntaxNode<T> = SyntaxNode<T>> extends SyntaxNode<T> {
  type: SyntaxNodeType.IfStatement;
  /**
   * The test condition of the if statement.
   */
  test: S;
  /**
   * The body of the if statement.
   */
  consequent: S;
  /**
   * The body of the else statement.s
   */
  alternate?: S;
}

export interface IfStatementRefNode<T> extends IfStatementSyntaxNode<T, RefSyntaxNode<T>>, RefSyntaxNode<T> {
  type: SyntaxNodeType.IfStatement;
}

export interface IfStatementUpdatedNode<T>
  extends IfStatementSyntaxNode<T, UpdatedSyntaxNode<T>>,
    UpdatedSyntaxNode<T> {
  type: SyntaxNodeType.IfStatement;
}

export function isIfStatementNode<T>(node: SyntaxNode<T>): node is IfStatementSyntaxNode<T> {
  return node.type === SyntaxNodeType.IfStatement;
}
