import { Range } from 'vscode';

export interface ASTPath<T extends object> {
  parent: ASTPath<T> | null;
  node: T;
  get(...args: string[]): ASTPath<T> | null;
  replace(node: T): void;
  push(node: T): void;
  unshift(node: T): void;
  pop(): T | undefined;
  shift(): T | undefined;
  append(node: T): void;
  insertAfter(node: T, after: T): void;
  insertBefore(node: T, after: T): void;
}

export type ASTVisitor<T extends object> = (this: { traverse: (path: ASTPath<T>) => void }, path: ASTPath<T>) => void;

export default interface ASTParser<T extends Object> {
  languages: string[];
  nodeTypes: {
    conditionContainer: string[];
    ifStatements: string[];
    loopStatements: string[];
    conditionalLoopStatements: string[];
  };

  parse(code: string): T;
  generate(ast: T): string;
  range(ast: T): Range;

  type(node: T): string;
  visit(node: T, types: string[], visitor: ASTVisitor<T>): void;

  getCondition(node: ASTPath<T>): ASTPath<T> | null;
}
