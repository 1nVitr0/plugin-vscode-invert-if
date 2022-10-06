import { visit } from "ast-types";
import { ExpressionKind, ForStatementKind, IfStatementKind, NodeKind, StatementKind } from "ast-types/gen/kinds";
import { NodePath } from "ast-types/lib/node-path";
import { SharedContextMethods } from "ast-types/lib/path-visitor";
import { prettyPrint, print } from "recast";
import { Range, TextDocument, TextEditorEdit, Uri } from "vscode";
import {
  BinaryExpressionRefNode,
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
  RefSyntaxNode,
  SyntaxNodeType,
  UnaryExpressionRefNode,
  UpdatedSyntaxNode,
} from "vscode-invert-if";
import JavaScriptParser from "./JavaScriptParser";
import { ProgramEntry } from "./ProgramEntry";

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
    document: TextDocument,
    range?: Range
  ): (RefSyntaxNode<NodePath<NodeKind>> & ExpressionContext<NodePath<NodeKind>>)[] {
    const program = this.parseDocument(document);
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
    condition: RefSyntaxNode<NodePath<NodeKind>> & ExpressionContext<NodePath<NodeKind>>
  ): Promise<RefSyntaxNode<NodePath<NodeKind>> & ExpressionContext<NodePath<NodeKind>>> {
    return this.resolveSyntaxNode(condition);
  }

  public provideIfStatements(document: TextDocument, range?: Range): IfStatementRefNode<NodePath<NodeKind>>[] {
    const program = this.parseDocument(document);
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
    statement: IfStatementRefNode<NodePath<NodeKind>>
  ): Promise<IfStatementRefNode<NodePath<NodeKind>>> {
    return this.resolveSyntaxNode(statement);
  }

  public replaceCondition(
    document: TextDocument,
    edit: TextEditorEdit,
    original: RefSyntaxNode<NodePath<NodeKind>>,
    replace: UpdatedSyntaxNode<NodePath<NodeKind>>
  ): void {
    const code = print(JavaScriptParser.getNodeKindFromSyntaxNode(replace)).code;
    edit.replace(original.range, code);
  }

  public replaceIfStatement(
    document: TextDocument,
    edit: TextEditorEdit,
    original: IfStatementRefNode<NodePath<NodeKind>>,
    replace: IfStatementRefNode<NodePath<NodeKind>>
  ): void {
    const code = print(JavaScriptParser.getNodeKindFromSyntaxNode(replace)).code;
    edit.replace(original.range, code);
  }

  public removeCondition(
    document: TextDocument,
    edit: TextEditorEdit,
    condition: RefSyntaxNode<NodePath<NodeKind>> & ExpressionContext<NodePath<NodeKind>>
  ): void {
    const { range, ref, parent } = condition;

    if (JavaScriptInvertIfProvider.replaceTrueParentStatement.includes(parent.ref.node.type)) {
      // Replace empty loop conditions with true
      edit.replace(range, "true");
    } else if (parent.type == SyntaxNodeType.IfStatement) {
      // Remove empty if statements, but keep else if
      const { alternate, consequent } = parent as IfStatementRefNode<NodePath<NodeKind>>;
      const indent = JavaScriptParser.getNodeIndentation(parent.ref.node, document);
      let code = JavaScriptParser.getBlockCode(document, consequent.ref, indent);
      if (alternate) code += `\n${JavaScriptParser.getCode(document, alternate.ref.node, indent)}`;
      code = JavaScriptParser.removeInitialIndent(document, parent.range, code);

      edit.replace(parent.range, code);
    } else if (ref.name == "left") {
      // Remove empty binary expressions (left)
      const { right } = parent as BinaryExpressionRefNode<NodePath<NodeKind>>;
      edit.replace(range.with(range.start, right.range.start), "");
    } else if (ref.name == "right") {
      // Remove empty binary expressions (right)
      const { left } = parent as BinaryExpressionRefNode<NodePath<NodeKind>>;
      edit.replace(range.with(left.range.end, range.end), "");
    } else if (ref.name == "argument") {
      // Remove empty unary expressions
      edit.replace(parent.range, "");
    } else {
      // Delete condition used as guard clause
      edit.replace(range, "");
    }
  }

  public prependSyntaxNode(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodePath<NodeKind>>,
    root: RefSyntaxNode<NodePath<NodeKind>>
  ): void {
    const indent = JavaScriptParser.getBlockIndentation(root.ref, document);
    const code = JavaScriptParser.getCode(document, JavaScriptParser.getNodeKindFromSyntaxNode(node), indent);
    const range = JavaScriptParser.getBlockRange(root.ref);

    edit.insert(range.start, `${JavaScriptParser.removeInitialIndent(document, range, code)}\n\n${indent}`);
  }

  public appendSyntaxNode(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodePath<NodeKind>>,
    root: RefSyntaxNode<NodePath<NodeKind>>
  ): void {
    const indent = JavaScriptParser.getBlockIndentation(root.ref, document);
    const code = JavaScriptParser.getCode(document, JavaScriptParser.getNodeKindFromSyntaxNode(node), indent);
    const range = JavaScriptParser.getBlockRange(root.ref);

    edit.insert(range.end, `\n\n${code}`);
  }

  public insertSyntaxNodeBefore(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodePath<NodeKind>>,
    before: RefSyntaxNode<NodePath<NodeKind>>
  ): void {
    const indent = JavaScriptParser.getNodeIndentation(before.ref.node, document);
    const code = JavaScriptParser.getCode(document, JavaScriptParser.getNodeKindFromSyntaxNode(node), indent);
    edit.insert(
      before.range.start,
      `${JavaScriptParser.removeInitialIndent(document, before.range, code)}\n\n${indent}`
    );
  }

  public insertSyntaxNodeAfter(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodePath<NodeKind>>,
    after: RefSyntaxNode<NodePath<NodeKind>>
  ): void {
    const indent = JavaScriptParser.getNodeIndentation(after.ref.node, document);
    const code = JavaScriptParser.getCode(document, JavaScriptParser.getNodeKindFromSyntaxNode(node), indent);
    edit.insert(after.range.end, `\n\n${code}`);
  }

  private getParser(languageId: string): JavaScriptParser {
    let parser = this.parsers.get(languageId);
    if (!parser) {
      parser = new JavaScriptParser(languageId);
      this.parsers.set(languageId, parser);
    }

    return parser;
  }

  private parseDocument(document: TextDocument): ProgramEntry {
    const { uri, version, languageId } = document;
    const program = this.programs.get(uri);

    if (program?.version === version) return program;

    const invalidatedProgram = this.getParser(languageId).parseDocument(document);
    this.programs.set(uri, invalidatedProgram);

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
