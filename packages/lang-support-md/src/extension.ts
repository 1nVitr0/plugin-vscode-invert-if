import { commands, Disposable, DocumentFilter, ExtensionContext, extensions } from "vscode";
import { InvertIfBaseProvider } from "vscode-invert-if";
import MarkdownEmbeddedLanguageProvider from "./MarkdownEmbeddedLanguageProvider";

/**
 * The document filter that selects for languages supported by your extension.
 */
const documentFilter: DocumentFilter[] = [{ language: "markdown" }];

let invertIf: InvertIfBaseProvider | undefined;
let provider: MarkdownEmbeddedLanguageProvider | undefined;

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
    provider = new MarkdownEmbeddedLanguageProvider();

    context.subscriptions.push(invertIf.registerEmbeddedLanguageProvider(provider, documentFilter));
  }
}

/**
 * This method is called when your extension is deactivated.
 * It should be used to clean up any resources that your extension has created.
 *
 * Registered Invert If providers are automatically unregistered, if their
 * Disposable is added to the context subscriptions.
 */
export function deactivate() {}

/**
 * This method is NOT part of this language extension.
 * It is only used internally, as Markdown support is shipped
 * together in the same extension.
 * When writing your own language extension, you can safely ignore this method.
 *
 * @param invertIf Extension instance of Invert If
 */
export function registerMarkdownInvertIfProvider(invertIf: InvertIfBaseProvider): Disposable[] {
  provider = new MarkdownEmbeddedLanguageProvider();

  return [invertIf.registerEmbeddedLanguageProvider(provider, documentFilter)];
}
