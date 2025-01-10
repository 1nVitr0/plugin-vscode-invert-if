import { commands, DocumentFilter, ExtensionContext, extensions } from "vscode";
import { InvertIfBaseProvider } from "vscode-invert-if";
import JavaScriptInvertIfProvider from "./JavaScriptInvertIfProvider";

/**
 * The document filter that selects for languages supported by your extension.
 */
const documentFilter: DocumentFilter[] = [
  { language: "typescript" },
  { language: "typescriptreact" },
  { language: "javascript" },
  { language: "javascriptreact" },
  { language: "flow" },
  { language: "babylon" },
];

let invertIf: InvertIfBaseProvider | undefined;
let provider: JavaScriptInvertIfProvider | undefined;

/**
 * This method is called when your extension is activated.
 *
 * @param context The extension context provided by VS Code.
 */
export async function activate(context: ExtensionContext) {
  // Load the Invert If extension to register the providers
  await commands.executeCommand("invertIf.loadPlugins");

  // Get the Invert If extension instance
  const invertIfExtension = extensions.getExtension<InvertIfBaseProvider>("1nVitr0.invert-if");

  if (invertIfExtension) {
    // Get the API from the Invert If extension
    invertIf = invertIfExtension.exports;

    // Register the JavaScript provider
    provider = new JavaScriptInvertIfProvider();

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
    // Unregister the JavaScript provider
    invertIf.unregisterConditionProvider(provider);
    invertIf.unregisterIfElseProvider(provider);
    invertIf.unregisterGuardClauseProvider(provider);
  }
}

/**
 * This method is NOT part of this language extension.
 * It is only used internally, as JavaScript and TypeScript support are shipped
 * together in the same extension.
 * When writing your own language extension, you can safely ignore this method.
 *
 * @internal
 * @param invertIf Extension instance of Invert If
 */
export function registerTypescriptInvertIfProvider(invertIf: InvertIfBaseProvider) {
  provider = new JavaScriptInvertIfProvider();

  invertIf.registerConditionProvider(provider, documentFilter);
  invertIf.registerIfElseProvider(provider, documentFilter);
  invertIf.registerGuardClauseProvider(provider, documentFilter);
}
