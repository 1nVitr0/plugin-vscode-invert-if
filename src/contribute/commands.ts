import { commands } from 'vscode';
import createGuardClause, { createCustomGuardClause } from '../commands/createGuardClause';
import invertCondition from '../commands/invertCondition';
import invertIfElse from '../commands/invertIfElse';

export default function contributeCommands() {
  return [
    commands.registerTextEditorCommand('invertIf.createGuardClause', createGuardClause),
    commands.registerTextEditorCommand('invertIf.createCustomGuardClause', createCustomGuardClause),
    commands.registerTextEditorCommand('invertIf.invertCondition', invertCondition),
    commands.registerTextEditorCommand('invertIf.invertIfElse', invertIfElse),
  ];
}
