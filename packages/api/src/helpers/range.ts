import { Range } from "vscode";
import { DocumentContext, isEmbeddedDocumentContext } from "../context/DocumentContext";

/**
 * Helper function to modify a range based on the context of the document.
 * Returns range relative to the global document when the context is an embedded section,
 * otherwise returns the range as is.
 *
 * @param range The range to modify.
 * @param context The context of the document.
 * @returns The modified range.
 */
export function rangeToGlobal(range: Range, context: DocumentContext): Range {
  if (!isEmbeddedDocumentContext(context)) return range;

  const { document, embeddedRange } = context;
  const { line: lineOffset, character: characterOffset } = embeddedRange.start;
  const { start, end } = range;

  return document.validateRange(
    new Range(
      start.with(start.line + lineOffset, start.character + characterOffset),
      end.with(end.line + lineOffset, start.line === end.line ? end.character + characterOffset : end.character)
    )
  );
}

/**
 * Helper function to modify a range based on the context of the document.
 * Returns range relative to the embedded section when the context is an embedded section,
 * otherwise returns the range as is.
 *
 * @param range The range to modify.
 * @param context The context of the document.
 * @returns The modified range.
 */
export function rangeToLocal(range: Range, context: DocumentContext): Range {
  if (!isEmbeddedDocumentContext(context)) return range;

  const { document, embeddedRange } = context;
  const { line: lineOffset, character: characterOffset } = embeddedRange.start;
  const { start, end } = range;

  return document.validateRange(
    new Range(
      start.with(start.line - lineOffset, start.character - characterOffset),
      end.with(end.line - lineOffset, start.line === end.line ? end.character - characterOffset : end.character)
    )
  );
}
