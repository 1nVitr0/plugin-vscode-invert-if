import { visit, Visitor } from 'ast-types';
import { NodeKind } from 'ast-types/gen/kinds';
import { parse, print } from 'recast';
import { Range } from 'vscode';
import ASTParser, { ASTPath, ASTVisitor } from './ASTParser';

export default class JavaScriptASTParser implements ASTParser<NodeKind> {
  public languages = ['javascript', 'typescript'];
  public nodeTypes: Record<keyof ASTParser<NodeKind>['nodeTypes'], (keyof Visitor)[]> = {
    conditionContainer: ['visitIfStatement', 'visitForStatement', 'visitWhileStatement', 'visitDoWhileStatement'],
    conditionalLoopStatements: [],
    ifStatements: [],
    loopStatements: [],
  };

  public parse(code: string): NodeKind {
    return parse(code);
  }

  public generate(ast: NodeKind): string {
    return print(ast).code;
  }

  public range(ast: NodeKind): Range {
    throw new Error('Method not implemented.');
  }

  public type(node: NodeKind): string {
    throw new Error('Method not implemented.');
  }

  public visit(node: NodeKind, types: string[], visitor: ASTVisitor<NodeKind>): void {
    const visitors = types.reduce<Visitor>((acc, type) => ({ ...acc, [type]: visitor }), {});
    visit(node, visitors);
  }

  public getCondition(node: ASTPath<NodeKind>): ASTPath<NodeKind> | null {
    throw new Error('Method not implemented.');
  }
}
