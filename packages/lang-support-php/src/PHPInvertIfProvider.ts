import { Block, Expression, For, If, Node, Statement } from "php-parser";
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
  UpdatedSyntaxNode
} from "vscode-invert-if";
import PHPParser from "./PHPParser";
import { NodeWithParent, ProgramEntry } from "./ProgramEntry";

export default class PHPInvertIfProvider
  implements
    InvertConditionProvider<NodeWithParent<Node>>,
    InvertIfElseProvider<NodeWithParent<Node>>,
    GuardClauseProvider<NodeWithParent<Node>>
{
  protected static replaceTrueParentStatement: Node["kind"][] = ["WhileStatement", "DoWhileStatement", "ForStatement"];

  private parsers: Map<`${5 | 6 | 7 | 8}.${number}` | undefined, PHPParser> = new Map();
  private programs: Map<Uri, ProgramEntry> = new Map();

  public provideConditions(
    document: TextDocument,
    range?: Range
  ): (RefSyntaxNode<NodeWithParent<Node>> & ExpressionContext<NodeWithParent<Node>>)[] {
    const program = this.parseDocument(document);
    const conditions: NodeWithParent<Expression>[] = [];

    function addCondition(node: NodeWithParent<Statement & { test: NodeWithParent<Node> }>) {
      const { test } = node;
      if (test && (!range || PHPParser.isRangeForNode(range, test))) {
        conditions.push(test);
      }
    }

    PHPParser.visit(program.program, {
      for: addCondition,
      if: addCondition,
      do: addCondition,
      while: addCondition,
    });

    return conditions.map((statement) => PHPParser.getSyntaxNodeFromNode(statement, program, true));
  }

  public async resolveCondition(
    condition: RefSyntaxNode<NodeWithParent<Node>> & ExpressionContext<NodeWithParent<Node>>
  ): Promise<RefSyntaxNode<NodeWithParent<Node>> & ExpressionContext<NodeWithParent<Node>>> {
    return this.resolveSyntaxNode(condition);
  }

  public provideIfStatements(document: TextDocument, range?: Range): IfStatementRefNode<NodeWithParent<Node>>[] {
    const program = this.parseDocument(document);
    const statements: NodeWithParent<If>[] = [];

    PHPParser.visit(program.program, {
      if: (node: NodeWithParent<If>) => {
        if (!range || PHPParser.isRangeForNode(range, node)) {
          statements.push(node as NodeWithParent<If>);
        }
      },
    });

    return statements.map(
      (statement) => PHPParser.getSyntaxNodeFromNode(statement, program) as IfStatementRefNode<NodeWithParent<If>>
    );
  }

  public async resolveIfStatement(
    statement: IfStatementRefNode<NodeWithParent<Node>>
  ): Promise<IfStatementRefNode<NodeWithParent<Node>>> {
    return this.resolveSyntaxNode(statement);
  }

  public replaceCondition(
    document: TextDocument,
    edit: TextEditorEdit,
    original: RefSyntaxNode<NodeWithParent<Node>>,
    replace: UpdatedSyntaxNode<NodeWithParent<Node>>
  ): void {
    const code = "TODO";
    edit.replace(original.range, code);
  }

  public replaceIfStatement(
    document: TextDocument,
    edit: TextEditorEdit,
    original: IfStatementRefNode<NodeWithParent<Node>>,
    replace: IfStatementRefNode<NodeWithParent<Node>>
  ): void {
    const code = "TODO";
    edit.replace(original.range, code);
  }

  public removeCondition(
    document: TextDocument,
    edit: TextEditorEdit,
    condition: RefSyntaxNode<NodeWithParent<Node>> & ExpressionContext<NodeWithParent<Node>>
  ): void {
    const { range, ref, parent } = condition;

    if (PHPInvertIfProvider.replaceTrueParentStatement.includes(parent.ref.kind)) {
      // Replace empty loop conditions with true
      edit.replace(range, "true");
    } else if (parent.type == SyntaxNodeType.IfStatement) {
      // Remove empty if statements, but keep else if
      const { alternate, consequent } = parent as IfStatementRefNode<NodeWithParent<Node>>;
      const indent = PHPParser.getNodeIndentation(parent.ref, document);
      let code = PHPParser.getBlockCode(document, consequent.ref as NodeWithParent<Node> & { body: Block }, indent);
      if (alternate) code += `\n${PHPParser.getCode(document, alternate.ref, indent)}`;
      code = PHPParser.removeInitialIndent(document, parent.range, code);

      edit.replace(parent.range, code);
    } else if (ref.pathName == "left") {
      // Remove empty binary expressions (left)
      const { right } = parent as BinaryExpressionRefNode<NodeWithParent<Node>>;
      edit.replace(range.with(range.start, right.range.start), "");
    } else if (ref.pathName == "right") {
      // Remove empty binary expressions (right)
      const { left } = parent as BinaryExpressionRefNode<NodeWithParent<Node>>;
      edit.replace(range.with(left.range.end, range.end), "");
    } else if (ref.pathName == "argument") {
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
    node: UpdatedSyntaxNode<NodeWithParent<Node>>,
    root: RefSyntaxNode<NodeWithParent<Node>>
  ): void {
    const indent = PHPParser.getBlockIndentation(root.ref as NodeWithParent<Node> & { body: Block }, document);
    const code = PHPParser.getCode(document, PHPParser.getNodeKindFromSyntaxNode(node), indent);
    const range = PHPParser.getBlockRange(root.ref as NodeWithParent<Node> & { body: Block });

    edit.insert(range.start, `${PHPParser.removeInitialIndent(document, range, code)}\n\n${indent}`);
  }

  public appendSyntaxNode(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodeWithParent<Node>>,
    root: RefSyntaxNode<NodeWithParent<Node>>
  ): void {
    const indent = PHPParser.getBlockIndentation(root.ref as NodeWithParent<Node> & { body: Block }, document);
    const code = PHPParser.getCode(document, PHPParser.getNodeKindFromSyntaxNode(node), indent);
    const range = PHPParser.getBlockRange(root.ref as NodeWithParent<Node> & { body: Block });

    edit.insert(range.end, `\n\n${code}`);
  }

  public insertSyntaxNodeBefore(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodeWithParent<Node>>,
    before: RefSyntaxNode<NodeWithParent<Node>>
  ): void {
    const indent = PHPParser.getNodeIndentation(before.ref, document);
    const code = PHPParser.getCode(document, PHPParser.getNodeKindFromSyntaxNode(node), indent);
    edit.insert(before.range.start, `${PHPParser.removeInitialIndent(document, before.range, code)}\n\n${indent}`);
  }

  public insertSyntaxNodeAfter(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodeWithParent<Node>>,
    after: RefSyntaxNode<NodeWithParent<Node>>
  ): void {
    const indent = PHPParser.getNodeIndentation(after.ref, document);
    const code = PHPParser.getCode(document, PHPParser.getNodeKindFromSyntaxNode(node), indent);
    edit.insert(after.range.end, `\n\n${code}`);
  }

  private getParser(languageId: string): PHPParser {
    const version = languageId.match(/php(\d+(\.\d+)?)/)?.[1] as `${5 | 6 | 7 | 8}.${number}` | undefined;
    let parser = this.parsers.get(version);
    if (!parser) {
      parser = new PHPParser(version);
      this.parsers.set(version, parser);
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

  private resolveSyntaxNode<N extends RefSyntaxNode<NodeWithParent<Node>>>(node: N): N {
    if (!isRefNode(node)) return node;

    if (isBinaryExpressionNode(node) || isLogicalExpressionNode(node)) {
      const { left, right } = node as
        | BinaryExpressionRefNode<NodeWithParent<Node>>
        | LogicalExpressionRefNode<NodeWithParent<Node>>;
      return {
        ...node,
        name: node.ref.loc?.source,
        description: node.ref.loc?.source,
        left: this.resolveSyntaxNode(left),
        right: this.resolveSyntaxNode(right),
      };
    } else if (isUnaryExpressionNode(node)) {
      const { argument } = node as unknown as UnaryExpressionRefNode<NodeWithParent<Node>>;
      return {
        ...node,
        name: node.ref.loc?.source,
        description: node.ref.loc?.source,
        argument: this.resolveSyntaxNode(argument),
      };
    } else if (isForNode(node)) {
      const { init, test, increment } = node.ref as NodeWithParent<For>;
      return {
        ...node,
        name: `for ${init[0]?.loc?.source ? init[0].loc.source : ""}; ${
          test[0]?.loc?.source ? test[0].loc.source : ""
        }; ${increment[0]?.loc?.source ? increment[0].loc.source : ""}) { ... }`,
        description: node.ref.loc?.source,
        test: this.resolveSyntaxNode(node.test as RefSyntaxNode<NodeWithParent<Node>>),
      };
    } else if (isLoopNode(node)) {
      return {
        ...node,
        name: node.ref.loc?.source,
        description: node.ref.loc?.source,
        test: this.resolveSyntaxNode((node as LoopRefNode<NodeWithParent<Node>>).test),
      };
    } else if (isIfStatementNode(node)) {
      return {
        ...node,
        name: `if (${this.resolveSyntaxNode(node.test as RefSyntaxNode<NodeWithParent<Node>>)}) { ... }`,
        description: node.ref.loc?.source,
        test: this.resolveSyntaxNode(node.test as RefSyntaxNode<NodeWithParent<Node>>),
        alternate: this.resolveSyntaxNode(node.alternate as RefSyntaxNode<NodeWithParent<Node>>),
        consequent: this.resolveSyntaxNode(node.consequent as RefSyntaxNode<NodeWithParent<Node>>),
      };
    } else {
      return {
        ...node,
        name: node.ref.loc?.source,
        description: node.ref.loc?.source,
      };
    }
  }
}
