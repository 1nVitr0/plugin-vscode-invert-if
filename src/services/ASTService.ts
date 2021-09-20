import { parse, types, print } from 'recast';
import { Range, TextDocument } from 'vscode';
import ConfigurationService from './ConfigurationService';

export default class ASTService {
  public constructor(private configurationService: ConfigurationService) {}

  public parse(code: string, language: string): types.ASTNode {
    const languageOptions =
      this.configurationService.languageOptions[language] || this.configurationService.languageOptions.default;
    return parse(code);
  }

  public stringify(node: types.ASTNode, language: string): string {
    return print(node).code;
  }

  public parseDocument(document: TextDocument, range?: Range): types.ASTNode {
    return this.parse(document.getText(range), document.languageId);
  }

  public parseDocumentRange(document: TextDocument, range: Range): types.ASTNode {
    return this.parse(document.getText(range), document.languageId);
  }
}
