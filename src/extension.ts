import { ExtensionContext } from 'vscode';
import contributeCodeActions from './contribute/codeActions';
import contributeCommands from './contribute/commands';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(...contributeCommands(), ...contributeCodeActions());
}

export function deactivate() {}
