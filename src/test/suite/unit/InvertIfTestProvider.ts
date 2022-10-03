import { TextDocument, Range, ProviderResult, TextEditorEdit } from "vscode";
import {
  ExpressionContext,
  GuardClauseProvider,
  IfStatementRefNode,
  IfStatementUpdatedNode,
  InvertConditionProvider,
  InvertIfElseProvider,
  RefSyntaxNode,
  UpdatedSyntaxNode,
} from "../../../api";

export class InvertIfTestprovider
  implements InvertConditionProvider<string>, InvertIfElseProvider<string>, GuardClauseProvider<string>
{
  provideIfStatements(document: TextDocument, range?: Range | undefined): ProviderResult<IfStatementRefNode<string>[]> {
    throw new Error("Method not implemented.");
  }
  resolveIfStatement?(statement: IfStatementRefNode<string>): ProviderResult<IfStatementRefNode<string>> {
    throw new Error("Method not implemented.");
  }
  replaceIfStatement(
    document: TextDocument,
    edit: TextEditorEdit,
    original: IfStatementRefNode<string>,
    replace: IfStatementUpdatedNode<string>
  ): void {
    throw new Error("Method not implemented.");
  }
  provideConditions(
    document: TextDocument,
    range?: Range | undefined
  ): ProviderResult<(RefSyntaxNode<string> & ExpressionContext<string>)[]> {
    throw new Error("Method not implemented.");
  }
  resolveCondition?(
    condition: RefSyntaxNode<string> & ExpressionContext<string>
  ): ProviderResult<RefSyntaxNode<string> & ExpressionContext<string>> {
    throw new Error("Method not implemented.");
  }
  removeCondition(
    document: TextDocument,
    edit: TextEditorEdit,
    condition: RefSyntaxNode<string> & ExpressionContext<string>
  ): void {
    throw new Error("Method not implemented.");
  }
  prependSyntaxNode(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<string>,
    root: RefSyntaxNode<string>
  ): void {
    throw new Error("Method not implemented.");
  }
  appendSyntaxNode(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<string>,
    root: RefSyntaxNode<string>
  ): void {
    throw new Error("Method not implemented.");
  }
  insertSyntaxNodeBefore(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<string>,
    before: RefSyntaxNode<string>
  ): void {
    throw new Error("Method not implemented.");
  }
  insertSyntaxNodeAfter(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<string>,
    after: RefSyntaxNode<string>
  ): void {
    throw new Error("Method not implemented.");
  }
  replaceCondition(
    document: TextDocument,
    edit: TextEditorEdit,
    original: RefSyntaxNode<string>,
    replace: UpdatedSyntaxNode<string>
  ): void {
    throw new Error("Method not implemented.");
  }
}
