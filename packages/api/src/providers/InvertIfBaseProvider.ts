import { DocumentSelector, Event } from "vscode";
import { Plugin } from "../context/Plugin";
import { GuardClauseProvider } from "./GuardClauseProvider";
import { InvertConditionProvider } from "./InvertConditionProvider";
import { InvertIfElseProvider } from "./InvertIfElseProvider";

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
   * Register a new provider, which can handle the inversion of conditions.
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
   * Register a new provider, which can handle the inversion of if-else statements.
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
   * Register a new provider, which can handle the creation of guard clauses.
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
   * Unregister a provider, which can handle the inversion of conditions.
   *
   * @param provider The provider that will be unregistered.
   */
  unregisterGuardClauseProvider<T>(provider: GuardClauseProvider<T>): void;
  /**
   * Unregister a provider, which can handle the inversion of if-else statements.
   *
   * @param provider The provider that will be unregistered.
   */
  unregisterConditionProvider<T>(provider: InvertConditionProvider<T>): void;
  /**
   * Unregister a provider, which can handle the creation of guard clauses.
   *
   * @param provider The provider that will be unregistered.
   */
  unregisterIfElseProvider<T>(provider: InvertIfElseProvider<T>): void;

  /**
   * Register an Event listener that is called when a plugin is registered.
   */
  onRegisterProvider: Event<Plugin<any>>;
  /**
   * Register an Event listener that is called when a plugin is unregistered.
   */
  onUnregisterProvider: Event<Plugin<any>>;
}
