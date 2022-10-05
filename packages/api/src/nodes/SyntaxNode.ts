import { Range } from "vscode";


/**
 * The type of a given syntax node.
 */
export enum SyntaxNodeType {
  Group,
  UnaryExpression,
  BinaryExpression,
  LogicalExpression,
  FunctionDeclaration,
  DoWhileStatement,
  ForStatement,
  IfStatement,
  WhileStatement,
  ReturnStatement,
  BreakStatement,
  ContinueStatement,
  Empty,
  Generic,
}

/**
 * A syntax node that represents a section of code.
 */
export interface SyntaxNode<T> {
  /**
   * The type of the syntax node.
   */
  type: SyntaxNodeType;
  /**
   * A descriptive name for the syntax node.
   */
  name?: string;
}

/**
 * A syntax node that represents a section of code.
 * It holds a direct reference to a syntax node in the original document,
 * provided by a language support plugin.
 */
export interface RefSyntaxNode<T> extends SyntaxNode<T> {
  /**
   * The range of the code represented by the syntax node.
   */
  range: Range;
  /**
   * Additional description for the syntax node.
   */
  description?: string;
  /**
   * The original syntax node.
   */
  ref: T;
}

/**
 * A syntax node that has been updated or created by the extension.
 * It may no longer hold a reference to the original syntax node.
 */
export interface UpdatedSyntaxNode<T> extends Partial<RefSyntaxNode<T>> {
  type: SyntaxNodeType;
  /**
   * Wether the syntax node has been updated.
   */
  changed?: true;
  /**
   * Wether the syntax node has been removed.
   */
  removed?: true;
  /**
   * Wether the syntax node has been added.
   */
  created?: true;
}

export function isRefNode(node: SyntaxNode<any>): node is RefSyntaxNode<any> {
  return (node as RefSyntaxNode<any>).ref !== undefined;
}
