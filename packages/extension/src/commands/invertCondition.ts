import { Range, TextEditor, TextEditorEdit, window } from "vscode";
import { service } from "../globals";

/**
 * @title Invert If: Invert Condition
 * @shortTitle Invert Condition
 * @command invertIf.invertCondition
 */
export default async function invertCondition(editor: TextEditor, editBuilder: TextEditorEdit, selection?: Range) {
  const selections = selection ? [selection] : editor.selections;
  const provider = service.plugins.getInvertConditionProvider(editor.document);

  if (!provider) {
    window.showErrorMessage("No invert condition provider found for this file type");
    return;
  }

  const selectionConditions = await Promise.all(
    selections.map((selection) => provider.provideConditions(editor.document, selection))
  );

  for (let i = 0; i < selections.length; i++) {
    const range = selections[i];
    const conditions = selectionConditions[i] ?? [];
    const condition = service.condition.sortConditionsByRangeMatch(conditions, range).shift();

    if (!condition) continue;

    const resolvedCondition = {
      ...condition,
      ...(await provider.resolveCondition?.(condition)),
    };

    editor.edit((edit) => service.condition.inverseCondition(editor.document, edit, provider, resolvedCondition));
  }
}
