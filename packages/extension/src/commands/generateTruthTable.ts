import generateMdTable from "json-md-table";
import { Range, TextEditor, TextEditorEdit, window, workspace } from "vscode";
import {
  DocumentContext,
  InvertConditionProvider,
  rangeToLocal,
  RefSyntaxNode,
  UpdatedSyntaxNode,
} from "vscode-invert-if";
import { service } from "../globals";

function showTruthTable(...conditionGroups: UpdatedSyntaxNode<any>[][]) {
  const { truthTableConditionIndex: conditionIndex } = service.config;

  const mdTables = conditionGroups.map((group) => {
    const title = group
      .map((condition, i) => {
        return `${service.lang.translateIndex(i + 1, conditionIndex)} \`${service.condition.getConditionName(
          condition
        )}\``;
      })
      .join("\n");

    let variableCount: number = 0;
    let resultCount: number = 0;
    const tables = group.map((condition) => service.validation.generateTruthTable(condition));
    const comparison = service.validation.combineTruthTables(...tables).map((row) => {
      const { result, ...permutations } = row;
      (variableCount = Object.keys(permutations).length), (resultCount = result.length);
      for (let i = 0; i < result.length; i++) permutations[`(${i + 1})`] = result[i];
      return permutations;
    });

    const alignment = [...new Array(variableCount).fill("right"), ...new Array(resultCount).fill("left")];
    const md = generateMdTable(indexConditions(comparison).sort(), { alignment, pretty: true });

    return `${title}\n\n${md}`;
  });

  workspace.openTextDocument({ language: "markdown", content: mdTables.join("\n\n\n") }).then(window.showTextDocument);
}

function indexConditions(conditions: Record<string, boolean>[]) {
  const { truthTableBooleanText, truthTableConditionIndex } = service.config;
  return conditions.map((row) =>
    Object.entries(row).reduce((row, [key, value]) => {
      const index = +(/\(\d+\)/.test(key) ? key.match(/\d+/)?.[0] ?? "0" : "0");
      const indexText = index ? service.lang.translateIndex(index, truthTableConditionIndex) : key;
      const booleanText = value ? truthTableBooleanText.true : truthTableBooleanText.false;

      return { ...row, [indexText]: booleanText };
    }, {})
  );
}

async function mapConditions<T>(context: DocumentContext, provider: InvertConditionProvider<T>, selections: Range[]) {
  return (
    await Promise.all(
      selections.map(async (selection) => {
        const translatedSelection = rangeToLocal(selection, context);
        const conditions = (await provider.provideConditions(context, translatedSelection)) ?? [];
        const condition = service.condition.sortConditionsByRangeMatch(conditions, translatedSelection).shift();
        return provider.resolveCondition && condition
          ? (await provider.resolveCondition(context, condition)) ?? condition
          : condition;
      })
    )
  ).filter((c) => !!c) as RefSyntaxNode<any>[];
}

/**
 * @title Invert If: Generate truth table
 * @shortTitle Generate truth table
 * @command invertIf.generateTruthTable
 */
export default async function generateTruthTable(editor: TextEditor, _: TextEditorEdit, selection?: Range) {
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

  const conditions = await mapConditions(context, provider, selections);

  showTruthTable(conditions);
}

/**
 * @title Invert If: Invert Condition and compare truth tables
 * @shortTitle Compare with inverted condition
 * @command invertIf.compareWithInvertedCondition
 */
export async function compareWithInvertedCondition(editor: TextEditor, _: TextEditorEdit, selection?: Range) {
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

  const conditions = await mapConditions(context, provider, selections);
  const inverted = conditions.map((condition) => [condition, service.condition.getInverseCondition(condition)]);

  showTruthTable(...inverted);
}
