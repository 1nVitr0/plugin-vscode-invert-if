import { commands, Range, TextEditor, TextEditorEdit, window } from "vscode";
import { DocumentContext, GuardClausePosition, GuardClauseType, rangeToLocal } from "vscode-invert-if";
import { service } from "../globals";

/**
 * @title Invert If: Create Guard Clause from Condition
 * @shortTitle Create Guard Clause
 * @command invertIf.createGuardClause
 */
export default async function createGuardClause(
  editor: TextEditor,
  _: TextEditorEdit,
  selection?: Range,
  position: GuardClausePosition = GuardClausePosition.Auto,
  type: GuardClauseType = GuardClauseType.Auto
) {
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

  const provider = service.plugins.getGuardClauseProvider(context);

  if (!provider) {
    window.showErrorMessage("No guard clause provider found for this file type");
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

      if (condition) service.guardClause.moveToGuardClause(context, edit, provider, condition, position, type);
    }
  });
}

/**
 * @title Invert If: Create Custom Guard Clause
 * @shortTitle Custom Guard Clause
 * @command invertIf.createCustomGuardClause
 */
export async function createCustomGuardClause(editor: TextEditor) {
  const typeOptions: (keyof typeof GuardClauseType)[] = ["Auto", "Break", "Continue", "Return"];
  const positionOptions: (keyof typeof GuardClausePosition)[] = ["Auto", "Prepend", "Append", "Keep"];

  const type = ((await window.showQuickPick(typeOptions, {
    title: "Guard clause type",
    placeHolder: "type",
  })) || "Auto") as keyof typeof GuardClauseType;
  const position = ((await window.showQuickPick(positionOptions, {
    title: "Guard clause position",
    placeHolder: "position",
  })) || "Auto") as keyof typeof GuardClausePosition;

  commands.executeCommand("invertIf.createGuardClause", null, GuardClausePosition[position], GuardClauseType[type]);
}
