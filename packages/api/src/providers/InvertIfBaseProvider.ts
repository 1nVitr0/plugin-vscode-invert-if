import { DocumentSelector, Event } from "vscode";
import { Plugin } from "../context/Plugin";
import { GuardClauseProvider } from "./GuardClauseProvider";
import { InvertConditionProvider } from "./InvertConditionProvider";
import { InvertIfElseProvider } from "./InvertIfElseProvider";

export interface InvertIfBaseProvider {
  registerGuardClauseProvider<T>(provider: GuardClauseProvider<T>, documentSelector: DocumentSelector): void;
  registerConditionProvider<T>(provider: InvertConditionProvider<T>, documentSelector: DocumentSelector): void;
  registerIfElseProvider<T>(provider: InvertIfElseProvider<T>, documentSelector: DocumentSelector): void;

  unregisterGuardClauseProvider<T>(provider: GuardClauseProvider<T>, documentSelector: DocumentSelector): void;
  unregisterConditionProvider<T>(provider: InvertConditionProvider<T>, documentSelector: DocumentSelector): void;
  unregisterIfElseProvider<T>(provider: InvertIfElseProvider<T>, documentSelector: DocumentSelector): void;

  onRegisterProvider: Event<Plugin<any>>;
  onUnregisterProvider: Event<Plugin<any>>;
}
