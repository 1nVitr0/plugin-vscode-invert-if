import { ProviderResult, Range, TextDocument, TextEditorEdit } from "vscode";
import { ExpressionContext } from "../context/ExpressionContext";
import { RefSyntaxNode, UpdatedSyntaxNode } from "../nodes/SyntaxNode";
import { InvertConditionProvider } from "./InvertConditionProvider";

export interface GuardClauseProvider<T> extends InvertConditionProvider<T> {
  provideConditions(document: TextDocument, range?: Range): ProviderResult<(RefSyntaxNode<T> & ExpressionContext<T>)[]>;
  resolveCondition?(
    condition: RefSyntaxNode<T> & ExpressionContext<T>
  ): ProviderResult<RefSyntaxNode<T> & ExpressionContext<T>>;

  removeCondition(
    document: TextDocument,
    edit: TextEditorEdit,
    condition: RefSyntaxNode<T> & ExpressionContext<T>
  ): void;
  prependSyntaxNode(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<T>,
    root: RefSyntaxNode<T>
  ): void;
  appendSyntaxNode(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<T>,
    root: RefSyntaxNode<T>
  ): void;
  insertSyntaxNodeBefore(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<T>,
    before: RefSyntaxNode<T>
  ): void;
  insertSyntaxNodeAfter(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<T>,
    after: RefSyntaxNode<T>
  ): void;
}
