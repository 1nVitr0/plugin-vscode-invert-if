import { PartialDeep } from 'type-fest';
import { FileKind, NodeKind } from 'ast-types/gen/kinds';
import { parse, types, print } from 'recast';
import { Range, TextDocument } from 'vscode';
import ConfigurationService from './ConfigurationService';
import { ASTNode } from 'ast-types';

export default class ASTService {
  private static isASTNode(node: any): node is types.ASTNode {
    return node && typeof node === 'object' && 'type' in node;
  }

  public static nodeRange(node: NodeKind): Range {
    if (!node.loc) return new Range(0, 0, 0, 0);

    const { start, end } = node.loc;
    return new Range(start.line - 1, start.column, end.line - 1, end.column);
  }

  public static nodeIntersectsRange(node: NodeKind, range: Range): boolean {
    if (!node.loc) return true;

    const intersect = range.intersection(this.nodeRange(node));
    return !intersect?.isEmpty;
  }

  public constructor(private configurationService: ConfigurationService) {}

  public parse(code: string, language: string): FileKind {
    const languageOptions =
      this.configurationService.languageOptions[language] || this.configurationService.languageOptions.default;
    return parse(code);
  }

  public stringify(node: types.ASTNode, language: string): string {
    return print(node).code;
  }

  /**  @alias parseDocument */
  public parseDocumentRange: (document: TextDocument, range: Range) => FileKind = this.parseDocument;
  public parseDocument(document: TextDocument, range?: Range): FileKind {
    return this.parse(document.getText(range), document.languageId);
  }

  public stripAttributes<N extends types.ASTNode>(
    node: N,
    attributes: (string | number | symbol)[] = ['original', 'loc', 'tokens']
  ): PartialDeep<N> {
    const clone: Partial<N> | PartialDeep<N> = {};
    for (const key of Object.keys(node) as (keyof N)[]) {
      if (attributes.includes(key)) continue;

      if (ASTService.isASTNode(node[key])) {
        // @ts-ignore ts does not realize node[key] is N[keyof N] and an ASTNode
        clone[key] = this.stripAttributes(node[key], attributes);
      } else if (node[key] instanceof Array) {
        //@ts-ignore ts does not realize node[key] is N[keyof N] and an array
        clone[key] = node[key].map((entry) =>
          ASTService.isASTNode(entry) ? this.stripAttributes(entry, attributes) : entry
        );
      } else {
        clone[key] = node[key];
      }
    }

    return clone as PartialDeep<N>;
  }
}
