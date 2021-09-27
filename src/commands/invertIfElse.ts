import { Range, TextEditor, TextEditorEdit, window } from 'vscode';
import { service } from '../injections';
import { NodeKind } from 'ast-types/gen/kinds';

/**
 * @title Invert If: Invert If / Else Block
 * @shortTitle Invert If / Else Block
 * @command invertIf.invertIfElse
 */
export default function invertIfElse(editor: TextEditor, editBuilder: TextEditorEdit, selection?: Range) {
  const selections = selection ? [selection] : editor.selections;

  let program;
  try {
    program = service.ast.parseDocument(editor.document);
  } catch (e: any) {
    return window.showErrorMessage(service.lang.errorMessage('parseError', e.description));
  }

  const changes: NodeKind[] = [];
  let hasErrors = false;
  for (const selection of selections) {
    try {
      const ifBlock = service.ast.extractIfBlocks(program, selection, 1).pop();

      if (!ifBlock || !ifBlock.node.loc) return window.showErrorMessage(service.lang.errorMessage('noIfBlock'));

      const inverse = service.ifElseInversion.inverse(ifBlock.node);
      inverse.loc = ifBlock.node.loc; // Keep location of previous Block
      changes.push(inverse);
    } catch (e) {
      window.showErrorMessage(service.lang.errorMessage('genericError', (e as Error).message));
      hasErrors = true;
    }
  }

  const hasChanges = service.ast.applyASTChanges(editor.document, editBuilder, ...changes);
  if (!hasChanges && !hasErrors) window.showInformationMessage(service.lang.infoMessage('noChanges'));
}
