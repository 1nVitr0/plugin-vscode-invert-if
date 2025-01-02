import { DocumentSelector, Event, Range } from "vscode";
import { Plugin } from "../context/Plugin";
import { GuardClauseProvider } from "./GuardClauseProvider";
import { InvertConditionProvider } from "./InvertConditionProvider";
import { InvertIfElseProvider } from "./InvertIfElseProvider";
import { EmbeddedLanguageProvider } from "./EmbeddedLanguageProvider";
import { DocumentContext } from "../context/DocumentContext";

/**
 * The interface that is provided by the `1nVitr0.invert-if` extension.
 *
 * @example Example usage in an extension adding language support for JavaScript:
 * ```typescript
 * import { InvertIfBaseProvider } from "vscode-invert-if";
 *
 * export function activate(context: ExtensionContext) {
 *   const invertIfExtension = extensions.getExtension<InvertIfBaseProvider>("1nVitr0.invert-if");
 *
 *   if (invertIfExtension) {
 *     invertIf = invertIfExtension.exports;
 *     provider = new JavaScriptInvertIfProvider();
 *
 *     invertIf.registerConditionProvider(provider, documentFilter);
 *     invertIf.registerIfElseProvider(provider, documentFilter);
 *     invertIf.registerGuardClauseProvider(provider, documentFilter);
 *   }
 * }
 * ```
 */
export interface InvertIfBaseProvider {
  /**
   * Register a new provider, which can handles the inversion of conditions.
   * It is recommended to register your provider for each type,
   * to prevent conflicts with other extensions.
   *
   * Your extension should call `unregisterConditionProvider` in `deactivate`.
   *
   * @param provider The provider that will be used to invert conditions.
   * @param documentSelector The document selector that selects for languages supported by your extension.
   */
  registerConditionProvider<T>(provider: InvertConditionProvider<T>, documentSelector: DocumentSelector): void;
  /**
   * Register a new provider, which can handles the inversion of if-else statements.
   * It is recommended to register your provider for each type,
   * to prevent conflicts with other extensions.
   *
   * Your extension should call `unregisterIfElseProvider` in `deactivate`.
   *
   * @param provider The provider that will be used to invert if-else statements.
   * @param documentSelector The document selector that selects for languages supported by your extension.
   */
  registerIfElseProvider<T>(provider: InvertIfElseProvider<T>, documentSelector: DocumentSelector): void;
  /**
   * Register a new provider, which can handles the creation of guard clauses.
   * It is recommended to register your provider for each type,
   * to prevent conflicts with other extensions.
   *
   * Your extension should call `unregisterGuardClauseProvider` in `deactivate`.
   *
   * @param provider The provider that will be used to create guard clauses.
   * @param documentSelector The document selector that selects for languages supported by your extension.
   */
  registerGuardClauseProvider<T>(provider: GuardClauseProvider<T>, documentSelector: DocumentSelector): void;
  /**
   * Register a new provider, which can handles the resolving of embedded language sections.
   * Your provider will be called based on the document selector and the sections will then be
   * passed on to the providers corresponding to the embedded language.
   *
   * Your extension should call `unregisterEmbeddedLanguageProvider` in `deactivate`.
   *
   * @param provider The provider that will be used to resolve embedded language sections.
   * @param documentSelector The document selector that selects for languages supported by your extension.
   */
  registerEmbeddedLanguageProvider(provider: EmbeddedLanguageProvider, documentSelector: DocumentSelector): void;

  /**
   * Unregister a provider, which can handles the inversion of conditions.
   *
   * @param provider The provider that will be unregistered.
   */
  unregisterGuardClauseProvider<T>(provider: GuardClauseProvider<T>): void;
  /**
   * Unregister a provider, which can handles the inversion of if-else statements.
   *
   * @param provider The provider that will be unregistered.
   */
  unregisterConditionProvider<T>(provider: InvertConditionProvider<T>): void;
  /**
   * Unregister a provider, which can handles the creation of guard clauses.
   *
   * @param provider The provider that will be unregistered.
   */
  unregisterIfElseProvider<T>(provider: InvertIfElseProvider<T>): void;
  /**
   * Unregister a provider, which can handles the resolving of embedded language sections.
   *
   * @param provider The provider that will be unregistered.
   */
  unregisterEmbeddedLanguageProvider(provider: EmbeddedLanguageProvider): void;

  /**
   * Helper function to modify a range based on the context of the document.
   * Returns range relative to the global document when the context is an embedded section,
   * otherwise returns the range as is.
   *
   * @param range The range to modify.
   * @param context The context of the document.
   * @returns The modified range.
   */
  rangeToGlobal(range: Range, context: DocumentContext): Range;

  /**
   * Helper function to modify a range based on the context of the document.
   * Returns range relative to the embedded section when the context is an embedded section,
   * otherwise returns the range as is.
   *
   * @param range The range to modify.
   * @param context The context of the document.
   * @returns The modified range.
   */
  rangeToLocal(range: Range, context: DocumentContext): Range;

  /**
   * Register an Event listener that is called when a plugin is registered.
   */
  onRegisterProvider: Event<Plugin<any>>;
  /**
   * Register an Event listener that is called when a plugin is unregistered.
   */
  onUnregisterProvider: Event<Plugin<any>>;
}
