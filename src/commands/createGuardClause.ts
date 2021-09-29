import { Range, TextEditor, TextEditorEdit, window, commands } from 'vscode';
import { service } from '../injections';
import { NodePath } from 'ast-types/lib/node-path';
import { NodeKind } from 'ast-types/gen/kinds';
import { GuardClausePosition, GuardClauseType } from '../services/GuardClauseService';

/**
 * @title Invert If: Create Guard Clause from Condition
 * @shortTitle Create Guard Clause
 * @command invertIf.createGuardClause
 */
export default function createGuardClause(
  editor: TextEditor,
  editBuilder: TextEditorEdit,
  selection?: Range | null,
  position: GuardClausePosition = GuardClausePosition.auto,
  type: GuardClauseType = GuardClauseType.auto
) {
  const selections = selection ? [selection] : editor.selections;

  let program;
  try {
    program = service.ast.parseDocument(editor.document);
  } catch (e: any) {
    return window.showErrorMessage(service.lang.errorMessage('parseError', e.description));
  }

  let hasErrors = false;
  const changes: NodePath<NodeKind>[] = [];
  for (const selection of selections) {
    try {
      const condition = service.ast.extractConditions(program, selection, 1).pop();
      if (!condition?.node || !condition.node.loc)
        return window.showErrorMessage(service.lang.errorMessage('conditionNotFound'));

      const block = service.ast.getFirstParent(condition, service.configuration.guardClauseParentTypes);

      if (!block?.node || !block.node.loc)
        return window.showErrorMessage(service.lang.errorMessage('invalidParentStatement'));

      const guardClause = service.guardClause.moveToGuardClause(block, condition, position, type);
      changes.push(guardClause);
    } catch (e) {
      window.showErrorMessage(service.lang.errorMessage('genericError', (e as Error).message));
      hasErrors = true;
    }
  }

  const hasChanges = service.ast.applyASTChanges(editor.document, editBuilder, ...changes.map(({ node }) => node));
  if (!hasChanges && !hasErrors) window.showInformationMessage(service.lang.infoMessage('noChanges'));
}

/**
 * @title Invert If: Create Custom Guard Clause
 * @shortTitle Custom Guard Clause
 * @command invertIf.createCustomGuardClause
 */
export async function createCustomGuardClause(editor: TextEditor) {
  const typeOptions: (keyof typeof GuardClauseType)[] = ['auto', 'break', 'continue', 'return'];
  const positionOptions: (keyof typeof GuardClausePosition)[] = ['auto', 'keep', 'prepend', 'append'];

  const type = ((await window.showQuickPick(typeOptions, {
    title: 'Guard clause type',
    placeHolder: 'type',
  })) || 'auto') as keyof typeof GuardClauseType;
  const position = ((await window.showQuickPick(positionOptions, {
    title: 'Guard clause position',
    placeHolder: 'position',
  })) || 'auto') as keyof typeof GuardClausePosition;

  commands.executeCommand('invertIf.createGuardClause', null, GuardClausePosition[position], GuardClauseType[type]);
}
