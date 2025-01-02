import { Range, TextEditor, TextEditorEdit, window } from "vscode";
import { service } from "../globals";
import { DocumentContext } from "vscode-invert-if";

const {
  plugins: { getEmbeddedLanguageProvider, getInvertIfElseProvider, rangeToLocal },
  embedded: { getPrimaryEmbeddedSection },
  ifElse: { inverseIfElse, sortIfStatementsByRangeMatch },
} = service;

/**
 * @title Invert If: Invert If / Else Block
 * @shortTitle Invert If / Else Block
 * @command invertIf.invertIfElse
 */
export default async function invertIfElse(editor: TextEditor, editBuilder: TextEditorEdit, selection?: Range) {
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

  const provider = getInvertIfElseProvider(context);

  if (!provider) {
    window.showErrorMessage("No invert if/else provider found for this file type");
    return;
  }

  const selectionStatements = await Promise.all(
    selections.map((selection) => provider.provideIfStatements(context, rangeToLocal(selection, context)))
  );
  editor.edit((edit) => {
    for (let i = 0; i < selections.length; i++) {
      const range = selections[i];
      const statements = selectionStatements[i] ?? [];
      const statement = sortIfStatementsByRangeMatch(statements, range).shift();

      if (statement) inverseIfElse(context, edit, provider, statement);
    }
  });
}
