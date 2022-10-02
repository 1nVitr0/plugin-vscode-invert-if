import { GuardClauseProvider } from "../api/providers/GuardClauseProvider";
import { InvertConditionProvider } from "../api/providers/InvertConditionProvider";
import { InvertIfElseProvider } from "../api/providers/InvertIfElseProvider";
import { DocumentFilter, DocumentSelector, TextDocument, languages } from "vscode";
import ConfigurationService from "./ConfigurationService";
import { InvertIfBaseProvider } from "../api/providers/InvertIfBaseProvider";

interface Plugin<T, P extends InvertConditionProvider<T> | InvertIfElseProvider<T> | GuardClauseProvider<T>> {
  documentSelector: DocumentSelector;
  capabilities: {
    invertCondition?: boolean;
    invertIfElse?: boolean;
    guardClause?: boolean;
  } & (P extends InvertConditionProvider<T> ? { invertCondition: true } : {}) &
    (P extends InvertIfElseProvider<T> ? { invertIfelse: true } : {}) &
    (P extends GuardClauseProvider<T> ? { guardClause: true } : {});
  provider: P;
}

export default class PluginService implements InvertIfBaseProvider {
  private plugins: Plugin<any, any>[] = [];

  public constructor(private configurationService: ConfigurationService) {}

  public registerConditionProvider<T>(provider: InvertConditionProvider<T>, documentSelector: DocumentSelector) {
    const existingPlugin = this.getExistingPlugin(provider);

    if (existingPlugin && this.compareDocumentSelectors(existingPlugin.documentSelector, documentSelector)) {
      existingPlugin.capabilities.invertCondition = true;
    }

    this.plugins.push({
      documentSelector,
      capabilities: { invertCondition: true },
      provider,
    });
  }

  public registerIfElseProvider<T>(provider: InvertIfElseProvider<T>, documentSelector: DocumentSelector) {
    const existingPlugin = this.getExistingPlugin(provider);

    if (existingPlugin && this.compareDocumentSelectors(existingPlugin.documentSelector, documentSelector)) {
      existingPlugin.capabilities.invertIfElse = true;
    }

    this.plugins.push({
      documentSelector,
      capabilities: { invertIfElse: true },
      provider,
    });
  }

  public registerGuardClauseProvider<T>(provider: GuardClauseProvider<T>, documentSelector: DocumentSelector) {
    const existingPlugin = this.getExistingPlugin(provider);

    if (existingPlugin && this.compareDocumentSelectors(existingPlugin.documentSelector, documentSelector)) {
      existingPlugin.capabilities.guardClause = true;
    }

    this.plugins.push({
      documentSelector,
      capabilities: { guardClause: true },
      provider,
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

  private compareDocumentSelectors(a: DocumentSelector, b: DocumentSelector): boolean {
    if (typeof a !== typeof b) return false;
    if (typeof a === "object" && typeof b == "object" && "length" in a !== "length" in b) return false;

    if (typeof a === "string") {
      return a === b;
    }

    if (typeof a === "object" && "length" in a && typeof b == "object" && "length" in b) {
      return a.every((aItem) => b.some((bItem) => this.compareDocumentSelectors(aItem, bItem)));
    }

    const _a = a as DocumentFilter;
    const _b = b as DocumentFilter;

    return (
      _a.language === _b.language && _a.scheme === _b.scheme && _a.pattern === _b.pattern && _a.scheme === _b.scheme
    );
  }

  private getExistingPlugin<T, P extends InvertConditionProvider<T> | InvertIfElseProvider<T> | GuardClauseProvider<T>>(
    provider: P
  ): Plugin<T, P> | undefined {
    return this.plugins.find((plugin) => plugin.provider === provider) as Plugin<T, P> | undefined;
  }
}
