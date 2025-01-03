import { Block, Expression, For, If, Node, Statement } from "php-parser";
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
  positionToGlobal,
  rangeToGlobal,
  RefSyntaxNode,
  SyntaxNodeType,
  UnaryExpressionRefNode,
  UpdatedSyntaxNode,
} from "vscode-invert-if";
import PHPParser from "./PHPParser";
import { NodeWithParent, ProgramEntry } from "./ProgramEntry";

export default class PHPInvertIfProvider
  implements
    InvertConditionProvider<NodeWithParent<Node>>,
    InvertIfElseProvider<NodeWithParent<Node>>,
    GuardClauseProvider<NodeWithParent<Node>>
{
  private static replaceTrueParentStatement: Node["kind"][] = ["while", "do", "for"];

  private parsers: Map<`${5 | 6 | 7 | 8}.${number}` | undefined, PHPParser> = new Map();
  private programs: Map<Uri, ProgramEntry> = new Map();

  public provideConditions(
    context: DocumentContext,
    range?: Range
  ): (RefSyntaxNode<NodeWithParent<Node>> & ExpressionContext<NodeWithParent<Node>>)[] {
    const program = this.parseDocumentContext(context);
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
    context: DocumentContext,
    condition: RefSyntaxNode<NodeWithParent<Node>> & ExpressionContext<NodeWithParent<Node>>
  ): Promise<RefSyntaxNode<NodeWithParent<Node>> & ExpressionContext<NodeWithParent<Node>>> {
    return this.resolveSyntaxNode(condition);
  }

  public provideIfStatements(context: DocumentContext, range?: Range): IfStatementRefNode<NodeWithParent<Node>>[] {
    const program = this.parseDocumentContext(context);
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
    context: DocumentContext,
    statement: IfStatementRefNode<NodeWithParent<Node>>
  ): Promise<IfStatementRefNode<NodeWithParent<Node>>> {
    return this.resolveSyntaxNode(statement);
  }

  public replaceCondition(
    context: DocumentContext,
    edit: TextEditorEdit,
    original: RefSyntaxNode<NodeWithParent<Node>>,
    replace: UpdatedSyntaxNode<NodeWithParent<Node>>
  ): void {
    const { document, languageId } = context;
    const code = this.getParser(languageId).stringifyNode(replace, document);
    edit.replace(rangeToGlobal(original.range, context), code);
  }

  public replaceIfStatement(
    context: DocumentContext,
    edit: TextEditorEdit,
    original: IfStatementRefNode<NodeWithParent<Node>>,
    replace: IfStatementRefNode<NodeWithParent<Node>>
  ): void {
    const code = "TODO";
    edit.replace(rangeToGlobal(original.range, context), code);
  }

  public removeCondition(
    context: DocumentContext,
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
      const indent = PHPParser.getNodeIndentation(parent.ref, context);
      let code = PHPParser.getBlockCode(consequent.ref as NodeWithParent<Node> & { body: Block }, context, indent);
      if (alternate) code += `\n${PHPParser.getCode(alternate.ref, context, indent)}`;
      code = PHPParser.removeInitialIndent(parent.range, context, code);

      edit.replace(rangeToGlobal(parent.range, context), code);
    } else if (ref.pathName == "left") {
      // Remove empty binary expressions (left)
      const { right } = parent as BinaryExpressionRefNode<NodeWithParent<Node>>;
      edit.replace(rangeToGlobal(range.with(range.start, right.range.start), context), "");
    } else if (ref.pathName == "right") {
      // Remove empty binary expressions (right)
      const { left } = parent as BinaryExpressionRefNode<NodeWithParent<Node>>;
      edit.replace(rangeToGlobal(range.with(left.range.end, range.end), context), "");
    } else if (ref.pathName == "argument") {
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
    node: UpdatedSyntaxNode<NodeWithParent<Node>>,
    root: RefSyntaxNode<NodeWithParent<Node>>
  ): void {
    const indent = PHPParser.getBlockIndentation(root.ref as NodeWithParent<Node> & { body: Block }, context);
    const code = PHPParser.getCode(PHPParser.getNodeFromSyntaxNode(node), context, indent);
    const range = PHPParser.getBlockRange(root.ref as NodeWithParent<Node> & { body: Block });

    edit.insert(
      positionToGlobal(range.start, context),
      `${PHPParser.removeInitialIndent(range, context, code)}\n\n${indent}`
    );
  }

  public appendSyntaxNode(
    context: DocumentContext,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodeWithParent<Node>>,
    root: RefSyntaxNode<NodeWithParent<Node>>
  ): void {
    const indent = PHPParser.getBlockIndentation(root.ref as NodeWithParent<Node> & { body: Block }, context);
    const code = PHPParser.getCode(PHPParser.getNodeFromSyntaxNode(node), context, indent);
    const range = PHPParser.getBlockRange(root.ref as NodeWithParent<Node> & { body: Block });

    edit.insert(positionToGlobal(range.end, context), `\n\n${code}`);
  }

  public insertSyntaxNodeBefore(
    context: DocumentContext,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodeWithParent<Node>>,
    before: RefSyntaxNode<NodeWithParent<Node>>
  ): void {
    const indent = PHPParser.getNodeIndentation(before.ref, context);
    const code = PHPParser.getCode(PHPParser.getNodeFromSyntaxNode(node), context, indent);
    edit.insert(
      positionToGlobal(before.range.start, context),
      `${PHPParser.removeInitialIndent(before.range, context, code)}\n\n${indent}`
    );
  }

  public insertSyntaxNodeAfter(
    context: DocumentContext,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NodeWithParent<Node>>,
    after: RefSyntaxNode<NodeWithParent<Node>>
  ): void {
    const indent = PHPParser.getNodeIndentation(after.ref, context);
    const code = PHPParser.getCode(PHPParser.getNodeFromSyntaxNode(node), context, indent);
    edit.insert(positionToGlobal(after.range.end, context), `\n\n${code}`);
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

  private parseDocumentContext(context: DocumentContext): ProgramEntry {
    const { languageId, document } = context;
    const program = this.programs.get(document.uri);

    if (program?.version === document.version) return program;

    const invalidatedProgram = this.getParser(languageId).parseDocumentContext(context);
    this.programs.set(document.uri, invalidatedProgram);

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
