import { ExtensionContext } from "vscode";
import InvertIfCodeActionProvider from "../providers/InvertIfCodeActionProvider";
import { service } from "../globals";

export default function contributeCodeActions(context: ExtensionContext) {
  const codeActionProvider = new InvertIfCodeActionProvider(service.plugins);
  codeActionProvider.register(service.plugins);

  return [codeActionProvider];
}
