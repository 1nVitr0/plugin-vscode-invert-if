import { Node, Parser } from 'acorn';
import { generate } from 'astring';
import { Range, TextDocument } from 'vscode';
import ConfigurationService from './ConfigurationService';

export default class ASTService {
  public constructor(private configurationService: ConfigurationService) {}

  public parse(code: string, language: string): Node {
    const languageOptions =
      this.configurationService.languageOptions[language] || this.configurationService.languageOptions.default;
    return Parser.parse(code, { ecmaVersion: languageOptions.useEcmaVersion });
  }

  public stringify(node: Node, language: string): string {
    return generate(node);
  }

  public parseDocument(document: TextDocument, range?: Range): Node {
    return this.parse(document.getText(range), document.languageId);
  }

  public parseDocumentRange(document: TextDocument, range: Range): Node {
    return this.parse(document.getText(range), document.languageId);
  }
}
