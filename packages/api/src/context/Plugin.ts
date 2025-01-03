import { DocumentSelector } from "vscode";
import { GuardClauseProvider } from "../providers/GuardClauseProvider";
import { InvertConditionProvider } from "../providers/InvertConditionProvider";
import { InvertIfElseProvider } from "../providers/InvertIfElseProvider";
import { EmbeddedLanguageProvider } from "../providers/EmbeddedLanguageProvider";

export interface Plugin<
  T,
  P extends InvertConditionProvider<T> | InvertIfElseProvider<T> | GuardClauseProvider<T> | EmbeddedLanguageProvider =
    | InvertConditionProvider<T>
    | InvertIfElseProvider<T>
    | GuardClauseProvider<T>
    | EmbeddedLanguageProvider
> {
  documentSelector: DocumentSelector;
  capabilities: {
    invertCondition?: boolean;
    invertIfElse?: boolean;
    guardClause?: boolean;
    embeddedLanguages?: boolean;
  } & (P extends InvertConditionProvider<T> ? { invertCondition: true } : {}) &
    (P extends InvertIfElseProvider<T> ? { invertIfelse: true } : {}) &
    (P extends GuardClauseProvider<T> ? { guardClause: true } : {}) &
    (P extends EmbeddedLanguageProvider ? { embeddedLanguages: true } : {});
  provider: P;
}
