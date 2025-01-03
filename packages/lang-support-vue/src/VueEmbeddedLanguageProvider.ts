import { Range, ProviderResult, TextDocument } from "vscode";
import { DocumentContext, EmbeddedLanguageProvider } from "vscode-invert-if";
import { EmbeddedLanguageSection } from "vscode-invert-if/dist/embed/EmbeddedLanguageSection";

export default class VueEmbeddedLanguageProvider implements EmbeddedLanguageProvider {
  private static readonly VUE_LANGUAGE_IDS: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    jsx: "javascriptreact",
    tsx: "typescriptreact",
  };

  provideEmbeddedSections(context: DocumentContext, range?: Range): ProviderResult<EmbeddedLanguageSection[]> {
    const scriptSection = this.getVueScriptSection(context.document);

    if (!scriptSection) return [];
    if (range && !scriptSection.range.intersection(range)) return [];

    return [scriptSection];
  }

  private getVueScriptSection(document: TextDocument): EmbeddedLanguageSection | null {
    const text = document.getText();
    const startIndex = text.indexOf("<script");
    const endIndex = text.indexOf("</script>");

    if (startIndex === -1 || endIndex === -1) return null;

    const start = document.positionAt(startIndex);
    const end = document.positionAt(endIndex);
    const languageExtension =
      document
        .lineAt(start.line)
        .text.trim()
        .match(/lang=['"](.+?)['"]/)?.[1] || "javascript";
    const languageId = VueEmbeddedLanguageProvider.VUE_LANGUAGE_IDS[languageExtension] || languageExtension;

    return {
      range: new Range(start.with(start.line + 1, 0), end.with(end.line - 1, Infinity)),
      languageId,
    };
  }
}
