import { SyntaxNodeType, RefSyntaxNode, SyntaxNode, UpdatedSyntaxNode } from "./SyntaxNode";

/**
 * Syntax node representing an execution keyword such as `return`, `break`, `continue`, etc.s
 */
export interface GeneralStatementSyntaxNode<T, S extends SyntaxNode<T> = SyntaxNode<T>> extends SyntaxNode<T> {
  type: SyntaxNodeType.ReturnStatement | SyntaxNodeType.BreakStatement | SyntaxNodeType.ContinueStatement;
  /**
   * The argument of the statement.
   */
  argument?: S;
}

export interface GeneralStatementRefNode<T> extends GeneralStatementSyntaxNode<T, RefSyntaxNode<T>>, RefSyntaxNode<T> {
  type: SyntaxNodeType.ReturnStatement | SyntaxNodeType.BreakStatement | SyntaxNodeType.ContinueStatement;
}

export interface GeneralStatementUpdatedNode<T>
  extends GeneralStatementSyntaxNode<T, UpdatedSyntaxNode<T>>,
    UpdatedSyntaxNode<T> {
  type: SyntaxNodeType.ReturnStatement | SyntaxNodeType.BreakStatement | SyntaxNodeType.ContinueStatement;
}

export function isGeneralStatementNode<T>(node: SyntaxNode<T>): node is GeneralStatementSyntaxNode<T> {
  return (
    node.type === SyntaxNodeType.ReturnStatement ||
    node.type === SyntaxNodeType.BreakStatement ||
    node.type === SyntaxNodeType.ContinueStatement
  );
}
