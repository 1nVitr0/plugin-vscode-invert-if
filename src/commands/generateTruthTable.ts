import { ExpressionKind, FileKind } from 'ast-types/gen/kinds';
import generateMdTable from 'json-md-table';
import { Range, TextEditor, TextEditorEdit, window, workspace } from 'vscode';
import { service } from '../injections';

function showTruthTable(conditions: ExpressionKind[]) {
  const groups = service.validation.groupConditions(conditions);

  const mdTables = groups.map((group) => {
    const title = group.map((condition, i) => `(${i + 1}) \`${service.ast.stringify(condition, 'js')}\``).join('\n');

    let variableCount: number = 0;
    let resultCount: number = 0;
    const tables = group.map((condition) => service.validation.generateTruthTable(condition));
    const comparison = service.validation.combineTruthTables(...tables).map((row) => {
      const { result, ...permutations } = row;
      (variableCount = Object.keys(permutations).length), (resultCount = result.length);
      for (let i = 0; i < result.length; i++) permutations[`(${i + 1})`] = result[i];
      return permutations;
    });

    const alignment = [...new Array(variableCount).fill('right'), ...new Array(resultCount).fill('left')];
    const md = generateMdTable(comparison.sort(), { alignment, pretty: true });

    return `${title}\n\n${md}`;
  });

  workspace.openTextDocument({ language: 'markdown', content: mdTables.join('\n\n\n') }).then(window.showTextDocument);
}

/**
 * @title Invert If: Generate truth table
 * @shortTitle Generate truth table
 * @command invertIf.generateTruthTable
 */
export default function generateTruthTable(editor: TextEditor, editBuilder: TextEditorEdit, selection?: Range) {
  const selections = selection ? [selection] : editor.selections;

  let program: FileKind;
  try {
    program = service.ast.parseDocument(editor.document);
  } catch (e: any) {
    return window.showErrorMessage(service.lang.errorMessage('parseError', e.description));
  }

  const conditions = selections
    .map((selection) => service.ast.extractConditions(program, selection, 1).pop()?.node)
    .filter((c) => !!c) as ExpressionKind[];

  showTruthTable(conditions);
}

/**
 * @title Invert If: Invert Condition and compare truth tables
 * @shortTitle Compare with inverted condition
 * @command invertIf.compareWithInvertedCondition
 */
export function compareWithInvertedCondition(editor: TextEditor, editBuilder: TextEditorEdit, selection?: Range) {
  const selections = selection ? [selection] : editor.selections;

  let program: FileKind;
  try {
    program = service.ast.parseDocument(editor.document);
  } catch (e: any) {
    return window.showErrorMessage(service.lang.errorMessage('parseError', e.description));
  }

  const conditions = selections
    .map((selection) => service.ast.extractConditions(program, selection, 1).pop()?.node)
    .filter((c) => !!c) as ExpressionKind[];
  const inverted = conditions.map((condition) => service.condition.inverse(condition));

  showTruthTable([...conditions, ...inverted]);
}
