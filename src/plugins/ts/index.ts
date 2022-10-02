import { DocumentFilter } from "vscode";
import { InvertIfBaseProvider } from "../../api";
import TypeScriptInvertIfProvider from "./TypeScriptInvertIfProvider";

const documentFilter: DocumentFilter[] = [
  { language: "typescript" },
  { language: "javascript" },
  { language: "flow" },
  { language: "babylon" },
];

export default function registerTypescriptInvertIfProvider(invertIf: InvertIfBaseProvider) {
  const provider = new TypeScriptInvertIfProvider();

  invertIf.registerConditionProvider(provider, documentFilter);
  invertIf.registerIfElseProvider(provider, documentFilter);
  invertIf.registerGuardClauseProvider(provider, documentFilter);
}
