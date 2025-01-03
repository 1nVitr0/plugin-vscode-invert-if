import { visit } from "ast-types";
import { ExpressionKind, ForStatementKind, IfStatementKind, NodeKind, StatementKind } from "ast-types/lib/gen/kinds";
import { NodePath } from "ast-types/lib/node-path";
import { SharedContextMethods } from "ast-types/lib/path-visitor";
import { prettyPrint, print } from "recast";
import { Range, TextEditorEdit, Uri } from "vscode";
import {
  BinaryExpressionRefNode,
  DocumentContext,
  ExpressionContext,
  GuardClauseProvider,
  IfStatementRefNode,
  InvertConditionProvider,
  InvertIfElseProvider,
  isBinaryExpressionNode,
  isForNode,
  isIfStatementNode,
  isLogicalExpressionNode,
  isLoopNode,
  isRefNode,
  isUnaryExpressionNode,
  LogicalExpressionRefNode,
  LoopRefNode,
  rangeToGlobal,
  RefSyntaxNode,
  SyntaxNodeType,
  UnaryExpressionRefNode,
  UpdatedSyntaxNode,
} from "vscode-invert-if";
import JavaScriptParser from "./JavaScriptParser";
import { ProgramEntry } from "./ProgramEntry";
import { positionToGlobal } from "../../api/src/helpers/position";

export default class JavaScriptInvertIfProvider
  implements
    InvertConditionProvider<NodePath<NodeKind>>,
    InvertIfElseProvider<NodePath<NodeKind>>,
    GuardClauseProvider<NodePath<NodeKind>>
{
  protected static replaceTrueParentStatement: NodeKind["type"][] = [
    "WhileStatement",
    "DoWhileStatement",
    "ForStatement",
  ];

  private parsers: Map<string, JavaScriptParser> = new Map();
  private programs: Map<Uri, ProgramEntry> = new Map();

  public provideConditions(
    context: DocumentContext,
    range?: Range
  ): (RefSyntaxNode<NodePath<NodeKind>> & ExpressionContext<NodePath<NodeKind>>)[] {
    const program = this.parseDocumentContext(context);
    const conditions: NodePath<ExpressionKind>[] = [];

    function addCondition(this: SharedContextMethods, path: NodePath<StatementKind & { test: any }>) {
      const test = path.get("test");
      if (test && (!range || JavaScriptParser.isRangeForNode(range, test.node))) {
        conditions.push(test);
      }

      this.traverse(path);
    }

    visit(program.programNode, {
      visitIfStatement: addCondition,
      visitForStatement: addCondition,
      visitWhileStatement: addCondition,
      visitDoWhileStatement: addCondition,
    });

    return conditions.map((statement) => JavaScriptParser.getSyntaxNodeFromPath(statement, program, true));
  }

  public async resolveCondition(
    context: DocumentContext,
    condition: RefSyntaxNode<NodePath<NodeKind>> & ExpressionContext<NodePath<NodeKind>>
  ): Promise<RefSyntaxNode<NodePath<NodeKind>> & ExpressionContext<NodePath<NodeKind>>> {
    return this.resolveSyntaxNode(condition);
  }

  public provideIfStatements(context: DocumentContext, range?: Range): IfStatementRefNode<NodePath<NodeKind>>[] {
    const program = this.parseDocumentContext(context);
    const statements: NodePath<IfStatementKind>[] = [];

    visit(program.programNode, {
      visitIfStatement(path) {
        if ((!range || JavaScriptParser.isNodeIntersectingRange(path.node, range)) && path.name !== "alternate")
          statements.push(path);
        this.traverse(path);
      },
    });

    return statements.map(
      (statement) =>
        JavaScriptParser.getSyntaxNodeFromPath(statement, program) as IfStatementRefNode<NodePath<NodeKind>>
    );
  }

  public async resolveIfStatement(
    context: DocumentContext,
    statement: IfStatementRefNode<NodePath<NodeKind>>
  ): Promise<IfStatementRefNode<NodePath<NodeKind>>> {
    return this.resolveSyntaxNode(statement);
  }

  public replaceCondition(
    context: DocumentContext,
    edit: TextEditorEdit,
    original: RefSyntaxNode<NodePath<NodeKind>>,
    replace: UpdatedSyntaxNode<NodePath<NodeKind>>
  ): void {
    const code = print(JavaScriptParser.getNodeKindFromSyntaxNode(replace)).code;
    edit.replace(rangeToGlobal(original.range, context), code);
  }

  public replaceIfStatement(
    context: DocumentContext,
    edit: TextEditorEdit,
    original: IfStatementRefNode<NodePath<NodeKind>>,
    replace: IfStatementRefNode<NodePath<NodeKind>>
  ): void {
    const code = print(JavaScriptParser.getNodeKindFromSyntaxNode(replace)).code;
    edit.replace(rangeToGlobal(original.range, context), code);
  }

  public removeCondition(
    context: DocumentContext,
    edit: TextEditorEdit,
    condition: RefSyntaxNode<NodePath<NodeKind>> & ExpressionContext<NodePath<NodeKind>>
  ): void {
    const { document } = context;
    const { range, ref, parent } = condition;

    if (JavaScriptInvertIfProvider.replaceTrueParentStatement.includes(parent.ref.node.type)) {
      // Replace empty loop conditions with true
      edit.replace(rangeToGlobal(range, context), "true");
    } else if (parent.type == SyntaxNodeType.IfStatement) {
      // Remove empty if statements, but keep else if
      const { alternate, consequent } = parent as IfStatementRefNode<NodePath<NodeKind>>;
      const indent = JavaScriptParser.getNodeIndentation(parent.ref.node, context);
      let code = JavaScriptParser.getBlockCode(consequent.ref, context, indent);
      if (alternate) code += `\n${JavaScriptParser.getCode(alternate.ref.node, context, indent)}`;
      code = JavaScriptParser.removeInitialIndent(parent.range, context, code);

      edit.replace(rangeToGlobal(parent.range, context), code);
    } else if (ref.name == "left") {
      // Remove empty binary expressions (left)
      const { right } = parent as BinaryExpressionRefNode<NodePath<NodeKind>>;
      edit.replace(rangeToGlobal(range.with(range.start, right.range.start), context), "");
    } else if (ref.name == "right") {
      // Remove empty binary expressions (right)
      const { left } = parent as BinaryExpressionRefNode<NodePath<NodeKind>>;
      edit.replace(rangeToGlobal(range.with(left.range.end, range.end), context), "");
    } else if (ref.name == "argument") {
      // Remove empty unary expressions
      edit.replace(rangeToGlobal(parent.range, context), "");
    } else {
      // Delete condition used as guard clause
      edit.replace(rangeToGlobal(range, context), "");
    }
  }

  public prependSyntaxNode(
    context: DocumentContext,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodePath<NodeKind>>,
    root: RefSyntaxNode<NodePath<NodeKind>>
  ): void {
    const indent = JavaScriptParser.getBlockIndentation(root.ref, context);
    const code = JavaScriptParser.getCode(JavaScriptParser.getNodeKindFromSyntaxNode(node), context, indent);
    const range = JavaScriptParser.getBlockRange(root.ref);

    edit.insert(
      positionToGlobal(range.start, context),
      `${JavaScriptParser.removeInitialIndent(range, context, code)}\n\n${indent}`
    );
  }

  public appendSyntaxNode(
    context: DocumentContext,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodePath<NodeKind>>,
    root: RefSyntaxNode<NodePath<NodeKind>>
  ): void {
    const indent = JavaScriptParser.getBlockIndentation(root.ref, context);
    const code = JavaScriptParser.getCode(JavaScriptParser.getNodeKindFromSyntaxNode(node), context, indent);
    const range = JavaScriptParser.getBlockRange(root.ref);

    edit.insert(positionToGlobal(range.end, context), `\n\n${code}`);
  }

  public insertSyntaxNodeBefore(
    context: DocumentContext,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodePath<NodeKind>>,
    before: RefSyntaxNode<NodePath<NodeKind>>
  ): void {
    const indent = JavaScriptParser.getNodeIndentation(before.ref.node, context);
    const code = JavaScriptParser.getCode(JavaScriptParser.getNodeKindFromSyntaxNode(node), context, indent);
    edit.insert(
      positionToGlobal(before.range.start, context),
      `${JavaScriptParser.removeInitialIndent(before.range, context, code)}\n\n${indent}`
    );
  }

  public insertSyntaxNodeAfter(
    context: DocumentContext,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodePath<NodeKind>>,
    after: RefSyntaxNode<NodePath<NodeKind>>
  ): void {
    const indent = JavaScriptParser.getNodeIndentation(after.ref.node, context);
    const code = JavaScriptParser.getCode(JavaScriptParser.getNodeKindFromSyntaxNode(node), context, indent);
    edit.insert(positionToGlobal(after.range.end, context), `\n\n${code}`);
  }

  private getParser(languageId: string): JavaScriptParser {
    let parser = this.parsers.get(languageId);
    if (!parser) {
      parser = new JavaScriptParser(languageId);
      this.parsers.set(languageId, parser);
    }

    return parser;
  }

  private parseDocumentContext(context: DocumentContext): ProgramEntry {
    const { languageId, document } = context;
    const program = this.programs.get(document.uri);

    if (program?.version === document.version) return program;

    const invalidatedProgram = this.getParser(languageId).parseDocumentContext(context);
    this.programs.set(document.uri, invalidatedProgram);

    return invalidatedProgram as ProgramEntry;
  }

  private resolveSyntaxNode<N extends RefSyntaxNode<NodePath<NodeKind>>>(node: N): N {
    if (!isRefNode(node)) return node;

    if (isBinaryExpressionNode(node) || isLogicalExpressionNode(node)) {
      const { left, right } = node as
        | BinaryExpressionRefNode<NodePath<NodeKind>>
        | LogicalExpressionRefNode<NodePath<NodeKind>>;
      return {
        ...node,
        name: print(node.ref.node).code,
        description: prettyPrint(node.ref.node).code,
        left: this.resolveSyntaxNode(left),
        right: this.resolveSyntaxNode(right),
      };
    } else if (isUnaryExpressionNode(node)) {
      const { argument } = node as unknown as UnaryExpressionRefNode<NodePath<NodeKind>>;
      return {
        ...node,
        name: print(node.ref.node).code,
        description: prettyPrint(node.ref.node).code,
        argument: this.resolveSyntaxNode(argument),
      };
    } else if (isForNode(node)) {
      const { init, test, update } = node.ref.node as ForStatementKind;
      return {
        ...node,
        name: `for ${init ? print(init) : ""}; ${test ? print(test) : ""}; ${update ? print(update) : ""}) { ... }`,
        description: prettyPrint(node.ref.node).code,
        test: this.resolveSyntaxNode(node.test as RefSyntaxNode<NodePath<NodeKind>>),
      };
    } else if (isLoopNode(node)) {
      return {
        ...node,
        name: print(node.ref.node).code,
        description: prettyPrint(node.ref.node).code,
        test: this.resolveSyntaxNode((node as LoopRefNode<NodePath<NodeKind>>).test),
      };
    } else if (isIfStatementNode(node)) {
      return {
        ...node,
        name: `if (${this.resolveSyntaxNode(node.test as RefSyntaxNode<NodePath<NodeKind>>)}) { ... }`,
        description: prettyPrint(node.ref.node).code,
        test: this.resolveSyntaxNode(node.test as RefSyntaxNode<NodePath<NodeKind>>),
        alternate: this.resolveSyntaxNode(node.alternate as RefSyntaxNode<NodePath<NodeKind>>),
        consequent: this.resolveSyntaxNode(node.consequent as RefSyntaxNode<NodePath<NodeKind>>),
      };
    } else {
      return {
        ...node,
        name: print(node.ref.node).code,
        description: prettyPrint(node.ref.node).code,
      };
    }
  }
}
