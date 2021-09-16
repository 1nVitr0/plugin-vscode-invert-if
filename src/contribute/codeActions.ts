import { languages } from 'vscode';
import InvertIfCodeActionProvider from '../providers/InvertIfCodeActionProvider';

export default function contributeCodeActions() {
  return [languages.registerCodeActionsProvider('', new InvertIfCodeActionProvider())];
}
