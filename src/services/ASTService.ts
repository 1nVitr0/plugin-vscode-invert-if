import { Node } from 'acorn';
import { Range, TextDocument } from 'vscode';

export default class ASTService {
  public parse(code: string): Node {
    throw new Error('not implemented');
  }

  public parseDocument(document: TextDocument, range?: Range): Node {
    return this.parse(document.getText(range));
  }

  public parseDocumentRange(document: TextDocument, range: Range): Node {
    return this.parse(document.getText(range));
  }
}
