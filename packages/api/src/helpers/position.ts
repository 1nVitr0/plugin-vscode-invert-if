import { Position, Range } from "vscode";
import { DocumentContext, isEmbeddedDocumentContext } from "../context/DocumentContext";

/**
 * Helper function to modify a position based on the context of the document.
 * Returns position relative to the global document when the context is an embedded section,
 * otherwise returns the position as is.
 *
 * @param position The position to modify.
 * @param context The context of the document.
 * @returns The modified position.
 */
export function positionToGlobal(position: Position, context: DocumentContext): Position {
  if (!isEmbeddedDocumentContext(context)) return position;

  const { document, embeddedRange } = context;
  const { line: lineOffset, character: characterOffset } = embeddedRange.start;

  return document.validatePosition(new Position(position.line + lineOffset, position.character + characterOffset));
}

/**
 * Helper function to modify a position based on the context of the document.
 * Returns position relative to the embedded section when the context is an embedded section,
 * otherwise returns the position as is.
 *
 * @param position The position to modify.
 * @param context The context of the document.
 * @returns The modified position.
 */
export function positionToLocal(position: Position, context: DocumentContext): Position {
  if (!isEmbeddedDocumentContext(context)) return position;

  const { document, embeddedRange } = context;
  const { line: lineOffset, character: characterOffset } = embeddedRange.start;

  return document.validatePosition(new Position(position.line - lineOffset, position.character - characterOffset));
}
