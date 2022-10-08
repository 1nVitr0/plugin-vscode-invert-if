import { Range, TextEditor, TextEditorEdit, window } from "vscode";
import { service } from "../globals";

/**
 * @title Invert If: Invert If / Else Block
 * @shortTitle Invert If / Else Block
 * @command invertIf.invertIfElse
 */
export default async function invertIfElse(editor: TextEditor, editBuilder: TextEditorEdit, selection?: Range) {
  const selections = selection ? [selection] : editor.selections;
  const provider = service.plugins.getInvertIfElseProvider(editor.document);

  if (!provider) {
    window.showErrorMessage("No invert if/else provider found for this file type");
    return;
  }

  const selectionStatements = await Promise.all(
    selections.map((selection) => provider.provideIfStatements(editor.document, selection))
  );

  for (let i = 0; i < selections.length; i++) {
    const range = selections[i];
    const statements = selectionStatements[i] ?? [];
    const statement = service.ifElse.sortIfStatementsByRangeMatch(statements, range).shift();

    if (!statement) continue;

    const resolvedStatement = {
      ...statement,
      ...(await provider.resolveIfStatement?.(statement)),
    };

    editor.edit((edit) => service.ifElse.inverseIfElse(editor.document, edit, provider, resolvedStatement));
  }
}
