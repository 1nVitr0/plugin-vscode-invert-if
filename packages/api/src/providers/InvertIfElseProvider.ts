import { ProviderResult, Range, TextDocument, TextEditorEdit } from "vscode";
import { IfStatementRefNode, IfStatementUpdatedNode } from "../nodes/IfStatementNode";

export interface InvertIfElseProvider<T> {
  provideIfStatements(document: TextDocument, range?: Range): ProviderResult<IfStatementRefNode<T>[]>;
  resolveIfStatement?(statement: IfStatementRefNode<T>): ProviderResult<IfStatementRefNode<T>>;

  replaceIfStatement(
    document: TextDocument,
    edit: TextEditorEdit,
    original: IfStatementRefNode<T>,
    replace: IfStatementUpdatedNode<T>
  ): void;
}
