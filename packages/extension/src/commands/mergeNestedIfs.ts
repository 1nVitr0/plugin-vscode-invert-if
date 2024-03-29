import { Range, TextEditor, TextEditorEdit, window } from "vscode";
import { service } from "../globals";
import { IfStatementRefNode } from "vscode-invert-if";

/**
 * @title Invert If: Merge selected if blocks
 * @shortTitle Merge if blocks
 * @command invertIf.mergeNestedIfs
 */
export default async function mergeNestedIfs(editor: TextEditor, _: TextEditorEdit, selection?: Range) {
  const selections = selection ? [selection] : editor.selections;
  const provider = service.plugins.getInvertIfElseProvider(editor.document);

  if (!provider) {
    window.showErrorMessage("No invert if/else provider found for this file type");
    return;
  }

  const selectionStatements = (
    await Promise.all(selections.map((selection) => provider.provideIfStatements(editor.document, selection)))
  ).reduce((acc: IfStatementRefNode<any>[], statements) => (statements ? acc.concat(statements) : acc), []);

  const groups = service.ifElse.groupIfStatementsByParent(selectionStatements);

  editor.edit((edit) => {
    for (const group of groups) {
      const parent = group.shift();
      if (parent) service.ifElse.mergeNestedIfs(editor.document, edit, provider, parent, ...group);
    }
  });
}
