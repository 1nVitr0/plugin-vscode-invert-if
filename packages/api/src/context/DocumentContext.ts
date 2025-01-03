import { Range, TextDocument } from "vscode";

/**
 * Information about the of the document that is being processed.
 * It may reference the current embedded language section,
 * otherwise it refers to the entire document.
 *
 * @see GuardClauseProvider
 */
export interface DocumentContext {
  /**
   * The document that is being processed.
   */
  document: TextDocument;
  /**
   * The language identifier of the document or the embedded language section.
   */
  languageId: string;
  /**
   * If set, the context refers to an embedded language section.
   * This is the range of the embedded section in the document.
   */
  embeddedRange?: Range;
  /**
   * If set, the context refers to an embedded language section.
   * This is the language identifier of the embedded section.
   * Will only be set if `embeddedRange` is set.
   */
  originalLanguageId?: string;
}

/**
 * A DocumentContext that refers to an embedded language section.
 */
export interface EmbeddedDocument extends DocumentContext {
  embeddedRange: Range;
  originalLanguageId: string;
}

export function isDocumentContext(context: TextDocument | DocumentContext): context is DocumentContext {
  return (context as DocumentContext).document !== undefined;
}

export function isEmbeddedDocumentContext(context: TextDocument | DocumentContext): context is EmbeddedDocument {
  return isDocumentContext(context) && context.embeddedRange !== undefined;
}
