import { DocumentFilter, ExtensionContext, extensions } from "vscode";
import { InvertIfBaseProvider } from "vscode-invert-if";
import PHPInvertIfProvider from "./PHPInvertIfProvider";

/**
 * The document filter that selects for languages supported by your extension.
 */
const documentFilter: DocumentFilter[] = [{ language: "php" }];

let invertIf: InvertIfBaseProvider | undefined;
let provider: PHPInvertIfProvider | undefined;

/**
 * This method is called when your extension is activated.
 *
 * @param context The extension context provided by VS Code.
 */
export function activate(context: ExtensionContext) {
  const invertIfExtension = extensions.getExtension<InvertIfBaseProvider>("1nVitr0.invert-if");

  if (invertIfExtension) {
    invertIf = invertIfExtension.exports;
    provider = new PHPInvertIfProvider();

    invertIf.registerConditionProvider(provider, documentFilter);
    invertIf.registerIfElseProvider(provider, documentFilter);
    invertIf.registerGuardClauseProvider(provider, documentFilter);
  }
}

/**
 * This method is called when your extension is deactivated.
 * It should be used to clean up any resources that your extension has created.
 */
export function deactivate() {
  if (invertIf && provider) {
    invertIf.unregisterConditionProvider(provider);
    invertIf.unregisterIfElseProvider(provider);
    invertIf.unregisterGuardClauseProvider(provider);
  }
}
