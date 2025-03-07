import {
  DocumentFilter,
  DocumentSelector,
  TextDocument,
  languages,
  EventEmitter,
  Disposable,
  window,
  Range,
} from "vscode";
import ConfigurationService from "./ConfigurationService";
import {
  DocumentContext,
  GuardClauseProvider,
  InvertConditionProvider,
  InvertIfBaseProvider,
  InvertIfElseProvider,
  isDocumentContext,
  isEmbeddedDocumentContext,
  Plugin,
} from "vscode-invert-if";
import { EmbeddedLanguageProvider } from "vscode-invert-if/dist/providers/EmbeddedLanguageProvider";
import { logger } from "../globals";

export default class PluginService implements InvertIfBaseProvider, Disposable {
  private plugins: Plugin<any, any>[] = [];
  private registerProviderEvent: EventEmitter<Plugin<any>>;
  private unregisterProviderEvent: EventEmitter<Plugin<any>>;

  public static compareDocumentSelectors(a: DocumentSelector, b: DocumentSelector, strict = true): boolean {
    if (typeof a !== typeof b) return false;
    if (typeof a === "object" && typeof b == "object" && "length" in a !== "length" in b) return false;

    if (typeof a === "string") {
      return a === b;
    }

    if (typeof a === "object" && "length" in a && typeof b == "object" && "length" in b) {
      return strict
        ? a.every((aItem) => b.some((bItem) => PluginService.compareDocumentSelectors(aItem, bItem)))
        : a.some((aItem) => b.some((bItem) => PluginService.compareDocumentSelectors(aItem, bItem)));
    }

    const _a = a as DocumentFilter;
    const _b = b as DocumentFilter;

    return (
      _a.language === _b.language && _a.scheme === _b.scheme && _a.pattern === _b.pattern && _a.scheme === _b.scheme
    );
  }

  public static describePlugin(plugin: Plugin<any>): string {
    const { capabilities, documentSelector } = plugin;
    const documentSelectorString = JSON.stringify(documentSelector);
    const capabilitiesString = Object.entries(capabilities)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(", ");

    return `for ${documentSelectorString} with capabilities [${capabilitiesString}]`;
  }

  public static matchDocumentContext(documentSelector: DocumentSelector, context: DocumentContext): boolean {
    if ((Array.isArray as (arg: DocumentSelector) => arg is ReadonlyArray<DocumentFilter | string>)(documentSelector)) {
      return documentSelector.some((selector) => PluginService.matchDocumentContext(selector, context));
    } else if (typeof documentSelector === "string") {
      return documentSelector === context.languageId;
    } else {
      return (
        documentSelector.language === context.languageId &&
        (!documentSelector.scheme || documentSelector.scheme === "embedded")
      );
    }
  }

  public static compareCapabilities<T>(a: Plugin<T>["capabilities"], b: Plugin<T>["capabilities"]): number {
    let result = 0;

    // We intentionally use weak compare, as `false` and `undefined` are treated equally
    if (a.invertCondition == b.invertCondition) result++;
    if (a.invertIfElse == b.invertIfElse) result++;
    if (a.guardClause == b.guardClause) result++;
    if (a.embeddedLanguages == b.embeddedLanguages) result++;

    return result;
  }

  public constructor(private configurationService: ConfigurationService) {
    this.registerProviderEvent = new EventEmitter();
    this.unregisterProviderEvent = new EventEmitter();

    this.init();
  }

  public registerConditionProvider<T>(provider: InvertConditionProvider<T>, documentSelector: DocumentSelector) {
    this.registerPlugin({
      provider,
      documentSelector,
      capabilities: { invertCondition: true },
    });

    return new Disposable(() => this.unregisterConditionProvider(provider));
  }

  public registerIfElseProvider<T>(provider: InvertIfElseProvider<T>, documentSelector: DocumentSelector) {
    this.registerPlugin({
      provider,
      documentSelector,
      capabilities: { invertIfElse: true },
    });

    return new Disposable(() => this.unregisterIfElseProvider(provider));
  }

  public registerGuardClauseProvider<T>(provider: GuardClauseProvider<T>, documentSelector: DocumentSelector) {
    this.registerPlugin({
      provider,
      documentSelector,
      capabilities: { guardClause: true },
    });

    return new Disposable(() => this.unregisterGuardClauseProvider(provider));
  }

  public registerEmbeddedLanguageProvider(provider: EmbeddedLanguageProvider, documentSelector: DocumentSelector) {
    this.registerPlugin({
      provider,
      documentSelector,
      capabilities: { embeddedLanguages: true },
    });

    return new Disposable(() => this.unregisterEmbeddedLanguageProvider(provider));
  }

  public unregisterConditionProvider<T>(provider: InvertConditionProvider<T>): void {
    this.unRegisterPlugin({
      provider,
      capabilities: { invertCondition: true },
    });
  }

  public unregisterIfElseProvider<T>(provider: InvertIfElseProvider<T>): void {
    this.unRegisterPlugin({
      provider,
      capabilities: { invertIfElse: true },
    });
  }

  public unregisterGuardClauseProvider<T>(provider: GuardClauseProvider<T>): void {
    this.unRegisterPlugin({
      provider,
      capabilities: { guardClause: true },
    });
  }

  public unregisterEmbeddedLanguageProvider(provider: EmbeddedLanguageProvider): void {
    this.unRegisterPlugin({
      provider,
      capabilities: { embeddedLanguages: true },
    });
  }

  public getAvailableCapabilities(context: DocumentContext): Plugin<any>["capabilities"] {
    const plugins = this.plugins.filter((plugin) =>
      PluginService.matchDocumentContext(plugin.documentSelector, context)
    );
    const capabilities = plugins.reduce(
      (acc, plugin) => {
        return {
          invertCondition: acc.invertCondition || plugin.capabilities.invertCondition,
          invertIfElse: acc.invertIfElse || plugin.capabilities.invertIfElse,
          guardClause: acc.guardClause || plugin.capabilities.guardClause,
          embeddedLanguages: acc.embeddedLanguages || plugin.capabilities.embeddedLanguages,
        };
      },
      {
        invertCondition: false,
        invertIfElse: false,
        guardClause: false,
        embeddedLanguages: false,
      } as Plugin<any>["capabilities"]
    );

    return capabilities;
  }

  public getAvailableDocumentSelector(
    withCapabilities?: (keyof Plugin<any>["capabilities"])[]
  ): ReadonlyArray<DocumentFilter | string> {
    const selectors: (DocumentFilter | string)[] = [];
    for (const { documentSelector, capabilities } of this.plugins) {
      const documentSelectors = documentSelector instanceof Array ? documentSelector : [documentSelector];
      if (withCapabilities && !withCapabilities.some((key) => capabilities[key])) continue;

      for (const selector of documentSelectors) {
        if (!selectors.some((compare) => PluginService.compareDocumentSelectors(selector, compare))) {
          selectors.push(selector);
        }
      }
    }

    return selectors;
  }

  public getInvertConditionProvider(context: TextDocument | DocumentContext): InvertConditionProvider<any> | undefined {
    const document = isDocumentContext(context) ? context.document : context;

    return isEmbeddedDocumentContext(context)
      ? this.plugins.find(
          ({ capabilities, documentSelector }) =>
            PluginService.matchDocumentContext(documentSelector, context) && capabilities.invertCondition
        )?.provider
      : this.plugins.find(
          ({ capabilities, documentSelector }) =>
            languages.match(documentSelector, document) && capabilities.invertCondition
        )?.provider;
  }

  public getInvertIfElseProvider(context: TextDocument | DocumentContext): InvertIfElseProvider<any> | undefined {
    const document = isDocumentContext(context) ? context.document : context;

    return isEmbeddedDocumentContext(context)
      ? this.plugins.find(
          ({ capabilities, documentSelector }) =>
            PluginService.matchDocumentContext(documentSelector, context) && capabilities.invertIfElse
        )?.provider
      : this.plugins.find(
          ({ capabilities, documentSelector }) =>
            languages.match(documentSelector, document) && capabilities.invertIfElse
        )?.provider;
  }

  public getGuardClauseProvider(context: TextDocument | DocumentContext): GuardClauseProvider<any> | undefined {
    const document = isDocumentContext(context) ? context.document : context;

    return isEmbeddedDocumentContext(context)
      ? this.plugins.find(
          ({ capabilities, documentSelector }) =>
            PluginService.matchDocumentContext(documentSelector, context) && capabilities.guardClause
        )?.provider
      : this.plugins.find(
          ({ capabilities, documentSelector }) =>
            languages.match(documentSelector, document) && capabilities.guardClause
        )?.provider;
  }

  public getEmbeddedLanguageProvider(context: TextDocument | DocumentContext): EmbeddedLanguageProvider | undefined {
    const document = isDocumentContext(context) ? context.document : context;

    return isEmbeddedDocumentContext(context)
      ? this.plugins.find(
          ({ capabilities, documentSelector }) =>
            PluginService.matchDocumentContext(documentSelector, context) && capabilities.embeddedLanguages
        )?.provider
      : this.plugins.find(
          ({ capabilities, documentSelector }) =>
            languages.match(documentSelector, document) && capabilities.embeddedLanguages
        )?.provider;
  }

  public onRegisterProvider<T>(listener: (e: Plugin<T>) => any): Disposable {
    return this.registerProviderEvent.event(listener);
  }

  public onUnregisterProvider<T>(listener: (e: Plugin<T>) => any): Disposable {
    return this.unregisterProviderEvent.event(listener);
  }

  public dispose() {
    this.registerProviderEvent.dispose();
    this.unregisterProviderEvent.dispose();
  }

  private init() {
    this.onRegisterProvider((plugin) => {
      logger.debug(`Registered plugin ${PluginService.describePlugin(plugin)}`);
    });
    this.onUnregisterProvider((plugin) => {
      logger.debug(`Unregistered plugin ${PluginService.describePlugin(plugin)}`);
    });
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

    if (existingPlugin && PluginService.compareDocumentSelectors(existingPlugin.documentSelector, documentSelector)) {
      for (const key of Object.keys(capabilities) as (keyof Plugin<T>["capabilities"])[]) {
        existingPlugin.capabilities[key] = existingPlugin.capabilities[key] || capabilities[key];
      }
      this.registerProviderEvent.fire(existingPlugin);

      return existingPlugin;
    }

    const newPlugin: Plugin<T> = {
      documentSelector: Array.isArray(documentSelector) ? [...documentSelector] : documentSelector,
      capabilities: { ...capabilities },
      provider,
    }; // Shallow copy to prevent modification of the original object
    this.plugins.push(newPlugin);
    this.registerProviderEvent.fire(newPlugin);

    return newPlugin;
  }

  private unRegisterPlugin<T>(plugin: Omit<Plugin<T>, "documentSelector">): Plugin<T> {
    const { capabilities, provider } = plugin;
    const existingPlugin = this.getExistingPlugin(provider);

    if (existingPlugin) {
      for (const key of Object.keys(capabilities) as (keyof Plugin<T>["capabilities"])[]) {
        if (capabilities[key] === true) existingPlugin.capabilities[key] = false;
      }

      if (
        !existingPlugin.capabilities.invertCondition &&
        !existingPlugin.capabilities.invertIfElse &&
        !existingPlugin.capabilities.guardClause
      ) {
        const index = this.plugins.indexOf(existingPlugin);
        this.plugins.splice(index, 1);
      }

      this.unregisterProviderEvent.fire(existingPlugin);
      return existingPlugin;
    } else {
      throw new Error("Plugin could not be unregistered because it was not registered.");
    }
  }

  private getExistingPlugin<T>(
    provider: InvertConditionProvider<T> | InvertIfElseProvider<T> | GuardClauseProvider<T> | EmbeddedLanguageProvider
  ): Plugin<T> | undefined {
    return this.plugins.find((plugin) => plugin.provider === provider) as Plugin<T> | undefined;
  }

  private getIntersectingPlugin<T>(plugin: Plugin<T>): Plugin<any> | undefined {
    return this.plugins.find(
      (compare) =>
        plugin.provider !== compare.provider &&
        PluginService.compareDocumentSelectors(plugin.documentSelector, compare.documentSelector, false) &&
        PluginService.compareCapabilities(plugin.capabilities, compare.capabilities)
    );
  }
}
