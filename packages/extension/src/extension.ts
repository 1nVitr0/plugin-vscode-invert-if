import { ExtensionContext, window } from "vscode";
import contributeCodeActions from "./contribute/codeActions";
import contributeCommands from "./contribute/commands";
import { registerTypescriptInvertIfProvider } from "invert-if-js";
import { service } from "./globals";

export function activate(context: ExtensionContext) {
  registerTypescriptInvertIfProvider(service.plugins);
  context.subscriptions.push(service, ...contributeCommands(), ...contributeCodeActions(context));

  return service.plugins;
}

export function deactivate() {
  window.showWarningMessage("Invert If is now deactivated. You must reload the window to use it again.");
}
