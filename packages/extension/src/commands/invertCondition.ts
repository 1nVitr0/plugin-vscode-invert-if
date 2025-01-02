import { Range, TextDocument, TextEditor, TextEditorEdit, window } from "vscode";
import { service } from "../globals";
import { DocumentContext } from "../../../api/dist/context/DocumentContext";

const {
  plugins: { getEmbeddedLanguageProvider, getInvertConditionProvider, rangeToLocal },
  embedded: { getPrimaryEmbeddedSection },
  condition: { sortConditionsByRangeMatch, inverseCondition },
} = service;

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

  const embedProvider = getEmbeddedLanguageProvider(editor.document);

  if (embedProvider) {
    const embeddedSection = await getPrimaryEmbeddedSection(context, embedProvider, selection);
    context.embeddedRange = embeddedSection?.range;
    context.languageId = embeddedSection?.languageId ?? languageId;
  }

  const provider = getInvertConditionProvider(context);

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
      const condition = sortConditionsByRangeMatch(conditions, range).shift();

      if (condition) inverseCondition(context, edit, provider, condition);
    }
  });
}
