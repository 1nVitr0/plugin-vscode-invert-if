import { RefSyntaxNode } from "../nodes/SyntaxNode";

/**
 * Additional information about the context in which a condition is used.
 * This is used by providers that create guard clauses.
 *
 * @see GuardClauseProvider
 */
export interface ExpressionContext<T> {
  /**
   * The "root" syntax node that contains the condition.
   * This is the main constructs that wraps the condition,
   * usually a function, or a loop
   */
  root: RefSyntaxNode<T>;
  /**
   * The direct parent syntax node of the condition.
   * This is usually an if statement or a loop header
   */
  parent: RefSyntaxNode<T>;
}
