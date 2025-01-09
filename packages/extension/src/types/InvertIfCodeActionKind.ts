import { CodeActionKind } from "vscode";

export class InvertIfCodeActionKind {
  public static InvertCondition = CodeActionKind.RefactorRewrite.append("invertCondition");
  public static InvertIfElse = CodeActionKind.RefactorRewrite.append("invertIfElse");
  public static MergeIfElse = CodeActionKind.RefactorRewrite.append("mergeIfElse");
  public static MoveToGuardClause = CodeActionKind.RefactorMove.append("moveToGuardClause");
}
