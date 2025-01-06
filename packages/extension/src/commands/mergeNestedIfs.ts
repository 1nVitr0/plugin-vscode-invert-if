import { Range, TextEditor, TextEditorEdit, window } from "vscode";
import { service } from "../globals";
import { DocumentContext, IfStatementRefNode, rangeToLocal } from "vscode-invert-if";

/**
 * @title Invert If: Merge selected if blocks
 * @shortTitle Merge if blocks
 * @command invertIf.mergeNestedIfs
 */
export default async function mergeNestedIfs(editor: TextEditor, _: TextEditorEdit, selection?: Range) {
  const { document, selections } = editor;
  const { languageId } = document;
  const context: DocumentContext = { document, languageId, originalLanguageId: languageId };

  if (selections.length <= 1) {
    window.showErrorMessage("Select multiple if statements to merge");
    return;
  }

  const embedProvider = service.plugins.getEmbeddedLanguageProvider(editor.document);

  if (embedProvider) {
    const embeddedSection = await service.embedded.getPrimaryEmbeddedSection(context, embedProvider, selection);
    context.embeddedRange = embeddedSection?.range;
    context.languageId = embeddedSection?.languageId ?? languageId;
  }

  const provider = service.plugins.getInvertIfElseProvider(context);

  if (!provider) {
    window.showErrorMessage("No invert if/else provider found for this file type");
    return;
  }

  const selectionStatements = (
    await Promise.all(
      selections.map((selection) => provider.provideIfStatements(context, rangeToLocal(selection, context)))
    )
  ).reduce((acc: IfStatementRefNode<any>[], statements) => (statements ? acc.concat(statements) : acc), []);

  const groups = service.ifElse.groupIfStatementsByParent(selectionStatements);

  editor.edit((edit) => {
    for (const group of groups) {
      const parent = group.shift();
      if (parent) service.ifElse.mergeNestedIfs(context, edit, provider, parent, ...group);
    }
  });
}
