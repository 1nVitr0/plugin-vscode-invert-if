import { ProviderResult, Range, TextDocument, TextEditorEdit } from "vscode";
import { ExpressionContext } from "../context/ExpressionContext";
import { RefSyntaxNode, UpdatedSyntaxNode } from "../nodes/SyntaxNode";
import { InvertConditionProvider } from "./InvertConditionProvider";

/**
 * A provider that can be registered to handle the creation of guard clauses.
 */
export interface GuardClauseProvider<T> extends InvertConditionProvider<T> {
  /**
   * Provide conditions for the given document and range.
   * Only top-level conditions should be returned.
   *
   * @example
   * ```typescript
   * // Given the following code:
   * if ((a && b) || c) {
   *   d();
   *   if (e) f();
   * }
   *
   * // The following conditions should be returned:
   * (a && b || c9
   * e
   * ```
   *
   * @param document The document for which to provide conditions
   * @param range The range for which to provide conditions
   * @return A list of conditions with references to the original syntax nodes.
   *         These must include additional information about the context in which the condition is used.
   */
  provideConditions(document: TextDocument, range?: Range): ProviderResult<(RefSyntaxNode<T> & ExpressionContext<T>)[]>;
  resolveCondition?(
    condition: RefSyntaxNode<T> & ExpressionContext<T>
  ): ProviderResult<RefSyntaxNode<T> & ExpressionContext<T>>;

  /**
   * Remove the given condition from the given document.
   *
   * @param document The document in which to remove the condition
   * @param edit The edit builder to use to remove the condition
   * @param condition The condition to remove (this always contains a reference to the original syntax node)
   */
  removeCondition(
    document: TextDocument,
    edit: TextEditorEdit,
    condition: RefSyntaxNode<T> & ExpressionContext<T>
  ): void;
  /**
   * Prepend the given syntax node to the root syntax node specified.
   * This is usually an if statement used as a guard clause.
   *
   * @param document The document in which to add the condition
   * @param edit The edit builder to use to add the condition
   * @param node The syntax node to prepend (this may not contain any references and could need to be rebuilt)
   * @param root The root syntax node to prepend to (this always contains a reference to the original syntax node)
   */
  prependSyntaxNode(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<T>,
    root: RefSyntaxNode<T>
  ): void;
  /**
   * Append the given syntax node to the root syntax node specified.
   * This is usually an if statement used as a guard clause.
   *
   * @param document The document in which to add the condition
   * @param edit The edit builder to use to add the condition
   * @param node The syntax node to append (this may not contain any references and could need to be rebuilt)
   * @param root The root syntax node to append to (this always contains a reference to the original syntax node)
   */
  appendSyntaxNode(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<T>,
    root: RefSyntaxNode<T>
  ): void;
  /**
   * Insert the given syntax node before the specified `before` syntax node.
   * This is usually an if statement used as a guard clause.
   *
   * @param document The document in which to add the condition
   * @param edit The edit builder to use to add the condition
   * @param node The syntax node to insert (this may not contain any references and could need to be rebuilt)
   * @param before The syntax node to insert before (this always contains a reference to the original syntax node)
   */
  insertSyntaxNodeBefore(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<T>,
    before: RefSyntaxNode<T>
  ): void;
  /**
   * Insert the given syntax node after the specified `after` syntax node.
   * This is usually an if statement used as a guard clause.
   *
   * @param document The document in which to add the condition
   * @param edit The edit builder to use to add the condition
   * @param node The syntax node to insert (this may not contain any references and could need to be rebuilt)
   * @param after The syntax node to insert after (this always contains a reference to the original syntax node)
   */
  insertSyntaxNodeAfter(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<T>,
    after: RefSyntaxNode<T>
  ): void;
}
