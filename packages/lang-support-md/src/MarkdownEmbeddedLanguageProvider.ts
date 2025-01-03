import { Range, ProviderResult, TextDocument, Position } from "vscode";
import { DocumentContext, EmbeddedLanguageProvider } from "vscode-invert-if";
import { EmbeddedLanguageSection } from "vscode-invert-if/dist/embed/EmbeddedLanguageSection";

export default class MarkdownEmbeddedLanguageProvider implements EmbeddedLanguageProvider {
  provideEmbeddedSections(context: DocumentContext, range?: Range): ProviderResult<EmbeddedLanguageSection[]> {
    const sections = this.getEmbeddedSections(context.document);

    return range ? sections.filter((section) => range.intersection(section.range)?.isEmpty === false) : sections;
  }

  private getEmbeddedSections(document: TextDocument): EmbeddedLanguageSection[] {
    const lines = document.getText().split(/\r?\n/);
    const sections: EmbeddedLanguageSection[] = [];

    // Find all code blocks in the markdown document
    let startPosition = new Position(0, 0);
    let languageId: string | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().startsWith("```")) {
        if (languageId) {
          sections.push({
            range: new Range(startPosition, new Position(i - 1, Infinity)),
            languageId,
          });
          languageId = null;
        } else {
          startPosition = new Position(i + 1, 0);
          languageId = line.trim().slice(3) || "plaintext";
        }
      }
    }

    if (languageId) {
      sections.push({
        range: new Range(startPosition, new Position(lines.length - 1, Infinity)),
        languageId,
      });
    }

    return sections;
  }
}
