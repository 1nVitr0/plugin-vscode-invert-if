import { DocumentFilter, ExtensionContext, extensions } from "vscode";
import { InvertIfBaseProvider } from "vscode-invert-if";
import VueEmbeddedLanguageProvider from "./VueEmbeddedLanguageProvider";

/**
 * The document filter that selects for languages supported by your extension.
 */
const documentFilter: DocumentFilter[] = [{ language: "markdown" }];

let invertIf: InvertIfBaseProvider | undefined;
let provider: VueEmbeddedLanguageProvider | undefined;

/**
 * This method is called when your extension is activated.
 *
 * @param context The extension context provided by VS Code.
 */
export function activate(context: ExtensionContext) {
  const invertIfExtension = extensions.getExtension<InvertIfBaseProvider>("1nVitr0.invert-if");

  if (invertIfExtension) {
    invertIf = invertIfExtension.exports;
    provider = new VueEmbeddedLanguageProvider();

    invertIf.registerEmbeddedLanguageProvider(provider, documentFilter);
  }
}

/**
 * This method is called when your extension is deactivated.
 * It should be used to clean up any resources that your extension has created.
 */
export function deactivate() {
  if (invertIf && provider) {
    invertIf.unregisterEmbeddedLanguageProvider(provider);
  }
}
