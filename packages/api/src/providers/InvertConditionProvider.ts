import { ProviderResult, Range, TextDocument, TextEditorEdit } from "vscode";
import { RefSyntaxNode, UpdatedSyntaxNode } from "../nodes/SyntaxNode";
import { DocumentContext } from "../context/DocumentContext";

/**
 * A provider that can be registered to handle the inversion of conditions.
 */
export interface InvertConditionProvider<T> {
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
   * @param context The context of the document for which to provide conditions
   * @param range The range for which to provide conditions
   *              (the range may refer to a range inside an embedded section @see DocumentContext)
   * @return A list of conditions with references to the original syntax nodes
   */
  provideConditions(context: DocumentContext, range?: Range): ProviderResult<RefSyntaxNode<T>[]>;
  /**
   * Resolve additional information for the given condition.
   *
   * @param context The context of the document in which to resolve the condition
   * @param condition The condition for which to resolve additional information
   * @return The condition with additional information (e.g. the condition's name)
   */
  resolveCondition?(context: DocumentContext, condition: RefSyntaxNode<T>): ProviderResult<RefSyntaxNode<T>>;

  /**
   * Replace the given condition with a new condition.
   *
   * @param context The context of the document in which to replace the condition
   * @param edit The edit builder to use to replace the condition
   * @param original The condition to replace (this always contains a reference to the original syntax node)
   * @param replace The new condition (this may not contain any references and could need to be rebuilt)
   */
  replaceCondition(
    context: DocumentContext,
    edit: TextEditorEdit,
    original: RefSyntaxNode<T>,
    replace: UpdatedSyntaxNode<T>
  ): void;
}
