export enum GuardClauseContext {
  WhileStatement,
  DoWhileStatement,
  ForStatement,
  FunctionDeclaration,
}

export enum GuardClauseType {
  Break,
  Continue,
  Return,
  Auto,
}

export enum GuardClausePosition {
  Prepend,
  Append,
  Keep,
  Auto,
}
