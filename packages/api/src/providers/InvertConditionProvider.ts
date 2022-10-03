import { ProviderResult, Range, TextDocument, TextEditorEdit } from "vscode";
import { RefSyntaxNode, UpdatedSyntaxNode } from "../nodes/SyntaxNode";

export interface InvertConditionProvider<T> {
  provideConditions(document: TextDocument, range?: Range): ProviderResult<RefSyntaxNode<T>[]>;
  resolveCondition?(condition: RefSyntaxNode<T>): ProviderResult<RefSyntaxNode<T>>;

  replaceCondition(
    document: TextDocument,
    edit: TextEditorEdit,
    original: RefSyntaxNode<T>,
    replace: UpdatedSyntaxNode<T>
  ): void;
}
