import { visit } from 'ast-types';
import {
  ExpressionKind,
  FileKind,
  IfStatementKind,
  NodeKind,
  StatementKind,
  LogicalExpressionKind,
} from 'ast-types/gen/kinds';
import { NodePath } from 'ast-types/lib/node-path';
import { SharedContextMethods } from 'ast-types/lib/path-visitor';
import { parse, print, types } from 'recast';
import { PartialDeep } from 'type-fest';
import { Range, TextDocument, TextEditorEdit } from 'vscode';
import ConfigurationService from './ConfigurationService';

export default class ASTService {
  public constructor(private configurationService: ConfigurationService) {}

  private isNodeKind(node: any): node is NodeKind {
    return node && typeof node === 'object' && 'type' in node;
  }

  public nodeRange(node: NodeKind): Range {
    if (!node.loc) return new Range(0, 0, 0, 0);

    const { start, end } = node.loc;
    return new Range(start.line - 1, start.column, end.line - 1, end.column);
  }

  public nodeIntersectsRange(node: NodeKind, range: Range): boolean {
    return !!node.loc && !!range.intersection(this.nodeRange(node));
  }

  public nodeContainsRange(node: NodeKind, range: Range): boolean {
    return !!node.loc && this.nodeRange(node).contains(range);
  }

  public isParentOf(parent: NodeKind, node: NodeKind): boolean {
    return this.nodeContainsRange(parent, this.nodeRange(node));
  }

  public nodeIndentation(node: NodeKind, document: TextDocument): string {
    const range = this.nodeRange(node);
    const line = document.getText(new Range(range.start.line, 0, range.start.line, Infinity));
    const indentMatch = line.match(/^\s*/);

    return indentMatch && indentMatch[0] ? indentMatch[0] : '';
  }

  public applyASTChanges(document: TextDocument, editBuilder: TextEditorEdit, ...changes: NodeKind[]): boolean {
    let hasChanges = false;
    for (const change of changes) {
      // Skip changes that are contained in parent nodes
      if (changes.some((parent) => parent !== change && this.isParentOf(parent, change))) continue;

      let code = this.stringify(change, document.languageId);
      const indent = this.nodeIndentation(change, document);
      code = code.replace(/(\r?\n)/g, `$1${indent}`); // Try to keep original indentation
      editBuilder.replace(this.nodeRange(change), code);
      hasChanges = true;
    }
    return hasChanges;
  }

  public extractConditions(node: NodeKind, range: Range | null = null, max = Infinity): NodePath<ExpressionKind>[] {
    const self = this;
    const conditions: NodePath<ExpressionKind>[] = [];

    function addCondition(this: SharedContextMethods, path: NodePath<StatementKind & { test: any }>) {
      if (!path.node.test || (range && !self.selectionIsForNode(range, path.node.test))) return this.traverse(path);

      conditions.push(path.get('test'));
      if (conditions.length >= max) {
        const deeperConditions = self.extractConditions(path.node.test, range, max);
        conditions.unshift(...deeperConditions);
        while (conditions.length > max) conditions.pop();
        return false;
      }

      this.traverse(path);
    }

    visit(node, {
      visitIfStatement: addCondition,
      visitForStatement: addCondition,
      visitWhileStatement: addCondition,
      visitDoWhileStatement: addCondition,
    });

    return conditions;
  }

  public extractIfBlocks(node: NodeKind, range: Range | null = null, max = Infinity): NodePath<IfStatementKind>[] {
    const self = this;
    const statements: NodePath<IfStatementKind>[] = [];

    visit(node, {
      visitIfStatement(path) {
        if (range && !self.nodeIntersectsRange(path.node, range)) return this.traverse(path);

        statements.push(path);
        if (statements.length >= max) {
          const deeperIfBlocks = self.extractIfBlocks(path.node.consequent, range, max);
          if (path.node.alternate) deeperIfBlocks.push(...self.extractIfBlocks(path.node.alternate, range, max));
          statements.unshift(...deeperIfBlocks);
          while (statements.length > max) statements.pop();
          return false;
        }

        this.traverse(path);
      },
    });

    return statements;
  }

  public chainConditions(operator: LogicalExpressionKind['operator'], ...conditions: ExpressionKind[]): ExpressionKind {
    let result = conditions.shift();
    if (!result) return types.builders.literal(false);

    let previous: ExpressionKind | undefined;
    while ((previous = conditions.shift())) result = types.builders.logicalExpression(operator, result, previous);

    return result;
  }

  public getFirstParent<N extends NodeKind, P extends NodeKind>(
    path: NodePath<N>,
    type: P['type'][]
  ): NodePath<P> | null {
    let parent: NodePath<P> | undefined = path.parent;
    while (parent && !(type as string[]).includes(parent.node.type)) parent = parent.parent;

    return parent || null;
  }

  public parse(code: string, language: string): FileKind {
    const languageOptions =
      this.configurationService.languageOptions[language] || this.configurationService.languageOptions.default;
    return parse(code);
  }

  public stringify(node: NodeKind, language: string): string {
    return print(node).code;
  }

  /**  @alias parseDocument */
  public parseDocumentRange: (document: TextDocument, range: Range) => FileKind = this.parseDocument;
  public parseDocument(document: TextDocument, range?: Range): FileKind {
    return this.parse(document.getText(range), document.languageId);
  }

  public stripAttributes<N extends NodeKind>(
    node: N,
    attributes: (string | number | symbol)[] = ['original', 'loc', 'tokens']
  ): PartialDeep<N> {
    const clone: Partial<N> | PartialDeep<N> = {};
    for (const key of Object.keys(node) as (keyof N)[]) {
      if (attributes.includes(key)) continue;

      if (this.isNodeKind(node[key])) {
        // @ts-ignore ts does not realize node[key] is N[keyof N] and an NodeKind
        clone[key] = this.stripAttributes(node[key], attributes);
      } else if (node[key] instanceof Array) {
        //@ts-ignore ts does not realize node[key] is N[keyof N] and an array
        clone[key] = node[key].map((entry) =>
          this.isNodeKind(entry) ? this.stripAttributes(entry, attributes) : entry
        );
      } else {
        //@ts-ignore this should not happen, but we always remove attributes
        clone[key] = node[key];
      }
    }

    return clone as PartialDeep<N>;
  }

  private selectionIsForNode(selection: Range, node: NodeKind): boolean {
    if (selection.isEmpty) return this.nodeIntersectsRange(node, selection);
    else return this.nodeContainsRange(node, selection);
  }
}
