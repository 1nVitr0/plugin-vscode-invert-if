import { ProviderResult, Range } from "vscode";
import { EmbeddedLanguageSection } from "../embed/EmbeddedLanguageSection";
import { DocumentContext } from "../context/DocumentContext";

/**
 * A provider that can be registered to handle embedded languages.
 */
export interface EmbeddedLanguageProvider {
  /**
   * Provide embedded sections for a document.
   *
   * @param context The context of the document for which to provide embedded sections
   *                (this may refer to an already embedded section to provide nested sections)
   * @param range The range for which to provide embedded sections
   * @return A list of embedded sections in the document
   */
  provideEmbeddedSections(context: DocumentContext, range?: Range): ProviderResult<EmbeddedLanguageSection[]>;
}
