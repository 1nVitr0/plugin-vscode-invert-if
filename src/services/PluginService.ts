import { GuardClauseProvider } from "../api/providers/GuardClauseProvider";
import { InvertConditionProvider } from "../api/providers/InvertConditionProvider";
import { InvertIfElseProvider } from "../api/providers/InvertIfElseProvider";
import { DocumentFilter, DocumentSelector, TextDocument, languages, EventEmitter, Disposable, window } from "vscode";
import ConfigurationService from "./ConfigurationService";
import { InvertIfBaseProvider } from "../api/providers/InvertIfBaseProvider";
import { Plugin } from "../api";

export default class PluginService implements InvertIfBaseProvider, Disposable {
  private plugins: Plugin<any, any>[] = [];
  private registerProviderEvent: EventEmitter<Plugin<any>>;

  public constructor(private configurationService: ConfigurationService) {
    this.registerProviderEvent = new EventEmitter();
  }

  public registerConditionProvider<T>(provider: InvertConditionProvider<T>, documentSelector: DocumentSelector) {
    this.registerPlugin({
      provider,
      documentSelector,
      capabilities: { invertCondition: true },
    });
  }

  public registerIfElseProvider<T>(provider: InvertIfElseProvider<T>, documentSelector: DocumentSelector) {
    this.registerPlugin({
      provider,
      documentSelector,
      capabilities: { invertIfElse: true },
    });
  }

  public registerGuardClauseProvider<T>(provider: GuardClauseProvider<T>, documentSelector: DocumentSelector) {
    this.registerPlugin({
      provider,
      documentSelector,
      capabilities: { guardClause: true },
    });
  }

  public getInvertConditionProvider(document: TextDocument): InvertConditionProvider<any> | undefined {
    return this.plugins.find(
      ({ capabilities, documentSelector }) =>
        languages.match(documentSelector, document) && capabilities.invertCondition
    )?.provider;
  }

  public getInvertIfElseProvider(document: TextDocument): InvertIfElseProvider<any> | undefined {
    return this.plugins.find(
      ({ capabilities, documentSelector }) => languages.match(documentSelector, document) && capabilities.invertIfElse
    )?.provider;
  }

  public getGuardClauseProvider(document: TextDocument): GuardClauseProvider<any> | undefined {
    return this.plugins.find(
      ({ capabilities, documentSelector }) => languages.match(documentSelector, document) && capabilities.guardClause
    )?.provider;
  }

  public onRegisterProvider(listener: (e: Plugin<any>) => any): Disposable {
    return this.registerProviderEvent.event(listener);
  }

  public dispose() {
    this.registerProviderEvent.dispose();
  }

  private registerPlugin<T>(plugin: Plugin<T>): Plugin<T> {
    const { capabilities, documentSelector, provider } = plugin;
    const existingPlugin = this.getExistingPlugin(provider);
    const intersectingPlugin = this.getIntersectingPlugin(plugin);

    if (intersectingPlugin) {
      window.showWarningMessage(
        "Multiple invert if providers for the same language have been registered. This may cause unexpected behavior."
      );
    }

    if (existingPlugin && this.compareDocumentSelectors(existingPlugin.documentSelector, documentSelector)) {
      for (const key of Object.keys(capabilities) as (keyof Plugin<T>["capabilities"])[]) {
        existingPlugin.capabilities[key] = existingPlugin.capabilities[key] || capabilities[key];
      }
      this.registerProviderEvent.fire(existingPlugin);

      return existingPlugin;
    }

    const newPlugin: Plugin<T> = {
      documentSelector,
      capabilities: { invertCondition: true },
      provider,
    };
    this.plugins.push(newPlugin);
    this.registerProviderEvent.fire(newPlugin);

    return newPlugin;
  }

  private compareDocumentSelectors(a: DocumentSelector, b: DocumentSelector, strict = true): boolean {
    if (typeof a !== typeof b) return false;
    if (typeof a === "object" && typeof b == "object" && "length" in a !== "length" in b) return false;

    if (typeof a === "string") {
      return a === b;
    }

    if (typeof a === "object" && "length" in a && typeof b == "object" && "length" in b) {
      return strict
        ? a.every((aItem) => b.some((bItem) => this.compareDocumentSelectors(aItem, bItem)))
        : a.some((aItem) => b.some((bItem) => this.compareDocumentSelectors(aItem, bItem)));
    }

    const _a = a as DocumentFilter;
    const _b = b as DocumentFilter;

    return (
      _a.language === _b.language && _a.scheme === _b.scheme && _a.pattern === _b.pattern && _a.scheme === _b.scheme
    );
  }

  private compareCapabilities<T>(a: Plugin<T>["capabilities"], b: Plugin<T>["capabilities"]): number {
    let result = 0;

    // We intentionally use weak compare, as `false` and `undefined` are treated equally
    if (a.invertCondition == b.invertCondition) result++;
    if (a.invertIfElse == b.invertIfElse) result++;
    if (a.guardClause == b.guardClause) result++;

    return result;
  }

  private getExistingPlugin<T>(
    provider: InvertConditionProvider<T> | InvertIfElseProvider<T> | GuardClauseProvider<T>
  ): Plugin<T> | undefined {
    return this.plugins.find((plugin) => plugin.provider === provider) as Plugin<T> | undefined;
  }

  private getIntersectingPlugin<T>(plugin: Plugin<T>): Plugin<any> | undefined {
    return this.plugins.find(
      (compare) =>
        plugin.provider !== compare.provider &&
        this.compareDocumentSelectors(plugin.documentSelector, compare.documentSelector, false) &&
        this.compareCapabilities(plugin.capabilities, compare.capabilities)
    );
  }
}
