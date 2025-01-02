import { Range, TextEditor, TextEditorEdit, window } from "vscode";
import { service } from "../globals";
import { DocumentContext, IfStatementRefNode } from "vscode-invert-if";

const {
  plugins: { getEmbeddedLanguageProvider, getInvertIfElseProvider, rangeToLocal },
  embedded: { getPrimaryEmbeddedSection },
  ifElse: { groupIfStatementsByParent, mergeNestedIfs: mergeNestedIfElse },
} = service;

/**
 * @title Invert If: Merge selected if blocks
 * @shortTitle Merge if blocks
 * @command invertIf.mergeNestedIfs
 */
export default async function mergeNestedIfs(editor: TextEditor, _: TextEditorEdit, selection?: Range) {
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

  const selectionStatements = (
    await Promise.all(
      selections.map((selection) => provider.provideIfStatements(context, rangeToLocal(selection, context)))
    )
  ).reduce((acc: IfStatementRefNode<any>[], statements) => (statements ? acc.concat(statements) : acc), []);

  const groups = groupIfStatementsByParent(selectionStatements);

  editor.edit((edit) => {
    for (const group of groups) {
      const parent = group.shift();
      if (parent) mergeNestedIfElse(context, edit, provider, parent, ...group);
    }
  });
}
