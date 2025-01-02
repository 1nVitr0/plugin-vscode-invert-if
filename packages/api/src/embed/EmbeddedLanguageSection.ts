import { Range } from "vscode";

/**
 * Additional information about a section of embedded content in a document.
 * All ranges and positions of nodes inside this context are relative to the embedded section.
 * The characters first line of the embedded section is at position 0 and must be offset
 * by the character index of the start of the embedded section to restore the original position.
 */
export interface EmbeddedLanguageSection {
  /**
   * The range of embedded content in the document.
   */
  range: Range;
  /**
   * The language identifier of the embedded content.
   */
  languageId: string;
}
