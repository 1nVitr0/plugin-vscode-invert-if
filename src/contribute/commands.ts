import { commands } from 'vscode';
import createGuardClause, { createCustomGuardClause } from '../commands/createGuardClause';
import invertCondition from '../commands/invertCondition';
import invertIfElse from '../commands/invertIfElse';
import mergeNestedIfs from '../commands/mergeNestedIfs';
import generateTruthTable from '../commands/generateTruthTable';
import { compareWithInvertedCondition } from '../commands/generateTruthTable';

export default function contributeCommands() {
  return [
    commands.registerTextEditorCommand('invertIf.createGuardClause', createGuardClause),
    commands.registerTextEditorCommand('invertIf.createCustomGuardClause', createCustomGuardClause),
    commands.registerTextEditorCommand('invertIf.invertCondition', invertCondition),
    commands.registerTextEditorCommand('invertIf.invertIfElse', invertIfElse),
    commands.registerTextEditorCommand('invertIf.mergeNestedIfs', mergeNestedIfs),
    commands.registerTextEditorCommand('invertIf.generateTruthTable', generateTruthTable),
    commands.registerTextEditorCommand('invertIf.compareWithInvertedCondition', compareWithInvertedCondition),
  ];
}
