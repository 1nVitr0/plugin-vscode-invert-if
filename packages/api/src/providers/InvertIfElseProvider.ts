import { ProviderResult, Range, TextEditorEdit } from "vscode";
import { IfStatementRefNode, IfStatementUpdatedNode } from "../nodes/IfStatementNode";
import { DocumentContext } from "../context/DocumentContext";

/**
 * A provider that can be registered to handle the inversion of if-else statements.
 */
export interface InvertIfElseProvider<T> {
  /**
   * Provide if-else statements for the given document and range.
   *
   * @example
   * ```typescript
   * // Given the following code:
   * if (a) {
   *   b();
   * } else  if(c){
   *   d();
   *   if (e) f();
   * }
   *
   * // The following if-else statements should be returned:
   * if (a) b() {...}
   * if (e) f() {...}
   * ```
   *
   * @param context The context of the document for which to provide if-else statements
   * @param range The range for which to provide if-else statements
   *              (the range may refer to a range inside an embedded section @see DocumentContext)
   * @return A list of if-else statements with references to the original syntax nodes
   */
  provideIfStatements(context: DocumentContext, range?: Range): ProviderResult<IfStatementRefNode<T>[]>;
  /**
   * Resolve additional information for the given if-else statement.
   *
   * @param context The context of the document in which to resolve the if-else statement
   * @param ifStatement The if-else statement for which to resolve additional information
   * @return The if-else statement with additional information (e.g. the if-else statement's name)
   */
  resolveIfStatement?(
    context: DocumentContext,
    statement: IfStatementRefNode<T>
  ): ProviderResult<IfStatementRefNode<T>>;

  /**
   * Replace the given if-else statement with a new if-else statement.
   *
   * @param context The context of the document in which to replace the if-else statement
   * @param edit The edit builder to use to replace the if-else statement
   * @param original The if-else statement to replace (this always contains a reference to the original syntax node)
   * @param replace The new if-else statement (this may not contain any references and could need to be rebuilt)
   */
  replaceIfStatement(
    context: DocumentContext,
    edit: TextEditorEdit,
    original: IfStatementRefNode<T>,
    replace: IfStatementUpdatedNode<T>
  ): void;
}
