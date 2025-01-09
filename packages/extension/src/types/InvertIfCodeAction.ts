import { CodeAction, Range, Selection, CodeActionKind } from "vscode";
import { SyntaxNode, DocumentContext } from "vscode-invert-if";

export class InvertIfCodeAction<N extends SyntaxNode<any> | SyntaxNode<any>[] = SyntaxNode<any>> extends CodeAction {
  public range: Range | Selection;
  public context: DocumentContext;
  public node?: N;

  public constructor(title: string, kind: CodeActionKind, context: DocumentContext, range: Range | Selection) {
    super(title, kind);
    this.context = context;
    this.range = range;
  }
}