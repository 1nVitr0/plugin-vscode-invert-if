import { commands, ExtensionContext, window } from "vscode";
import contributeCodeActions from "./contribute/codeActions";
import contributeCommands from "./contribute/commands";
import { registerTypescriptInvertIfProvider } from "invert-if-js";
import { service } from "./globals";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(service, ...contributeCommands(), ...contributeCodeActions(context));

  // Trigger plugins with activation event `onCommand:invertIf.loadPlugins`
  registerTypescriptInvertIfProvider(service.plugins);
  commands.executeCommand("invertIf.loadPlugins");

  return service.plugins;
}

export function deactivate() {
  window.showWarningMessage("Invert If is now deactivated. You must reload the window to use it again.");
}
