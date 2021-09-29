import { NodeKind } from 'ast-types/gen/kinds';
import { Range, TextEditor, TextEditorEdit, window } from 'vscode';
import { service } from '../injections';

/**
 * @title Invert If: Invert Condition
 * @shortTitle Invert Condition
 * @command invertIf.invertCondition
 */
export default function invertCondition(editor: TextEditor, editBuilder: TextEditorEdit, selection?: Range) {
  const selections = selection ? [selection] : editor.selections;

  let program;
  try {
    program = service.ast.parseDocument(editor.document);
  } catch (e: any) {
    return window.showErrorMessage(service.lang.errorMessage('parseError', e.description));
  }

  let hasErrors = false;
  const changes: NodeKind[] = [];
  for (const selection of selections) {
    try {
      const condition = service.ast.extractConditions(program, selection, 1).pop();

      if (!condition || !condition.node.loc)
        return window.showErrorMessage(service.lang.errorMessage('conditionNotFound'));

      const inverse = service.condition.inverse(condition.node);
      inverse.loc = condition.node.loc; // Keep location of previous Block
      changes.push(inverse);
    } catch (e) {
      window.showErrorMessage(service.lang.errorMessage('genericError', (e as Error).message));
      hasErrors = true;
    }
  }

  const hasChanges = service.ast.applyASTChanges(editor.document, editBuilder, ...changes);
  if (!hasChanges && !hasErrors) window.showInformationMessage(service.lang.infoMessage('noChanges'));
}
