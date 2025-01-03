import { Range, TextEditor, TextEditorEdit, window } from "vscode";
import { service } from "../globals";
import { DocumentContext, rangeToLocal } from "vscode-invert-if";

/**
 * @title Invert If: Invert Condition
 * @shortTitle Invert Condition
 * @command invertIf.invertCondition
 */
export default async function invertCondition(editor: TextEditor, editBuilder: TextEditorEdit, selection?: Range) {
  const { document } = editor;
  const { languageId } = document;
  const selections = selection ? [selection] : [...editor.selections];
  const context: DocumentContext = { document, languageId, originalLanguageId: languageId };

  const embedProvider = service.plugins.getEmbeddedLanguageProvider(editor.document);

  if (embedProvider) {
    const embeddedSection = await service.embedded.getPrimaryEmbeddedSection(context, embedProvider, selection);
    context.embeddedRange = embeddedSection?.range;
    context.languageId = embeddedSection?.languageId ?? languageId;
  }

  const provider = service.plugins.getInvertConditionProvider(context);

  if (!provider) {
    window.showErrorMessage("No invert condition provider found for this file type");
    return;
  }

  const selectionConditions = await Promise.all(
    selections.map((selection) => provider.provideConditions(context, rangeToLocal(selection, context)))
  );

  editor.edit((edit) => {
    for (let i = 0; i < selections.length; i++) {
      const range = selections[i];
      const conditions = selectionConditions[i] ?? [];
      const condition = service.condition.sortConditionsByRangeMatch(conditions, range).shift();

      if (condition) service.condition.inverseCondition(context, edit, provider, condition);
    }
  });
}
