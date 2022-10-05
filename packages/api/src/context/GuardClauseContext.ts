/**
 * The context wín which a condition is used.
 * This is generally the type of the `root` syntax node as specified in
 *{@link ExpressionContext.root}
 */
export enum GuardClauseContext {
  WhileStatement,
  DoWhileStatement,
  ForStatement,
  FunctionDeclaration,
}

/**
 * The type of a generated guard clause.
 */
export enum GuardClauseType {
  Break,
  Continue,
  Return,
  Auto,
}

/**
 * The position of a generated guard clause.
 */
export enum GuardClausePosition {
  Prepend,
  Append,
  Keep,
  Auto,
}
