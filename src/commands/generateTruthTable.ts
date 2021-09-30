import { ExpressionKind, FileKind } from 'ast-types/gen/kinds';
import { markdownTable } from 'markdown-table';
import { Range, TextEditor, TextEditorEdit, window, workspace } from 'vscode';
import { service } from '../injections';

function showTruthTable(conditions: ExpressionKind[]) {
  const groups = service.validation.groupConditions(conditions);

  const mdTables = groups.map((group) => {
    const title = group.map((condition, i) => `(${i + 1}) \`${service.ast.stringify(condition, 'js')}\``).join('\n');

    const tables = group.map((condition) => service.validation.generateTruthTable(condition));
    const comparison = service.validation.combineTruthTables(...tables).map((row) => {
      const { result, ...permutations } = row;
      for (let i = 0; i < result.length; i++) permutations[`(${i + 1})`] = result[i];
      return permutations;
    });
    const csv = [
      Object.keys(comparison[0]),
      ...comparison.map((row) => Object.values(row).map((v) => v.toString())).sort(),
    ];

    return `${title}\n\n${markdownTable(csv)}`;
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
