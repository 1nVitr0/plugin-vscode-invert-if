import { DocumentSelector } from "vscode";
import { GuardClauseProvider } from "../providers/GuardClauseProvider";
import { InvertConditionProvider } from "../providers/InvertConditionProvider";
import { InvertIfElseProvider } from "../providers/InvertIfElseProvider";

export interface Plugin<
  T,
  P extends InvertConditionProvider<T> | InvertIfElseProvider<T> | GuardClauseProvider<T> =
    | InvertConditionProvider<T>
    | InvertIfElseProvider<T>
    | GuardClauseProvider<T>
> {
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
