import { ExtensionContext } from 'vscode';
import contributeCodeActions from './contribute/codeActions';
import contributeCommands from './contribute/commands';
import registerTypescriptInvertIfProvider from "./plugins/ts/index";
import { service } from "./globals";

export function activate(context: ExtensionContext) {
  registerTypescriptInvertIfProvider(service.plugins);
  context.subscriptions.push(...contributeCommands(), ...contributeCodeActions());
}

export function deactivate() {}
