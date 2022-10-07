import {
  Bin,
  Block,
  Break,
  Continue,
  Do,
  Engine,
  For,
  If,
  Location,
  Node,
  Noop,
  Program,
  Return,
  Unary,
  While,
} from "php-parser";
import { Range, TextDocument } from "vscode";
import {
  BinaryExpressionRefNode,
  BinaryExpressionUpdatedNode,
  BinaryOperator,
  DoWhileStatementRefNode,
  ExpressionContext,
  ForStatementRefNode,
  FunctionDeclarationRefNode,
  GeneralStatementRefNode,
  GenericRefNode,
  IfStatementRefNode,
  IfStatementUpdatedNode,
  LogicalExpressionRefNode,
  LogicalExpressionUpdatedNode,
  LogicalOperator,
  RefSyntaxNode,
  SyntaxNodeType,
  UnaryExpressionRefNode,
  UnaryExpressionUpdatedNode,
  UnaryOperator,
  UpdatedSyntaxNode,
  WhileStatementRefNode,
} from "vscode-invert-if";
import { NodeWithParent, ProgramEntry } from "./ProgramEntry";

type AnyConstructor<N extends Node> = new (...args: any) => N;

export default class PHPParser {
  private static guardClauseParentTypes: NodeWithParent<Node>["kind"][] = [
    "WhileStatement",
    "ForStatement",
    "ForAwaitStatement",
    "ForInStatement",
    "ForOfStatement",
    "DoWhileStatement",
    "FunctionExpression",
    "FunctionDeclaration",
    "ArrowFunctionExpression",
  ];
  protected static replaceTrueParentStatement: NodeWithParent<Node>["kind"][] = [
    "WhileStatement",
    "DoWhileStatement",
    "ForStatement",
  ];
  private static binaryExpressionOperators: Partial<Record<Bin["type"], BinaryOperator>> = {
    "==": BinaryOperator.Equal,
    "!=": BinaryOperator.NotEqual,
    "===": BinaryOperator.StrictEqual,
    "!==": BinaryOperator.StrictNotEqual,
    "<": BinaryOperator.LessThan,
    "<=": BinaryOperator.LessThanOrEqual,
    ">": BinaryOperator.GreaterThan,
    ">=": BinaryOperator.GreaterThanOrEqual,
  };
  private static logicalExpressionOperators: Partial<Record<Bin["type"], LogicalOperator>> = {
    "||": LogicalOperator.Or,
    "&&": LogicalOperator.And,
    "??": LogicalOperator.NullishCoalescing,
  };
  private static unaryExpressionOperators: Partial<Record<Unary["type"], UnaryOperator>> = {
    "!": UnaryOperator.Not,
    "+": UnaryOperator.Positive,
    "-": UnaryOperator.Negative,
  };

  public static getBlockCode(
    document: TextDocument,
    node: NodeWithParent<Node> & { body: Block },
    indent?: string
  ): string {
    if (indent === undefined) indent = this.getNodeIndentation(node, document);

    return (
      (node.body.children as NodeWithParent<Node>[]).map((node) => this.getCode(document, node, indent)).join("\n") ??
      ""
    );
  }

  public static getBlockIndentation(node: NodeWithParent<Node> & { body: Block }, document: TextDocument): string {
    const firstStatement = node.body.children[0] as NodeWithParent<Node>;

    return firstStatement ? this.getNodeIndentation(firstStatement, document) : "";
  }

  public static getBlockRange(node: NodeWithParent<Node> & { body: Block }): Range {
    const { body } = node;
    const start = body.children[0]?.loc?.start ?? body.loc?.start;
    const end = body.children[body.children.length - 1]?.loc?.end ?? body.loc?.end;

    if (!start || !end) return new Range(0, 0, 0, 0);

    return new Range(start.line - 1, start.column, end.line - 1, end.column);
  }

  private static getBinaryExpressionOperator(operator: BinaryOperator): Bin["type"] {
    for (const [key, value] of Object.entries(this.binaryExpressionOperators)) {
      if (value == operator) return key as Bin["type"];
    }

    throw new Error(`Unknown binary operator: ${operator}`);
  }

  private static getLogicalExpressionOperator(operator: LogicalOperator): Bin["type"] {
    for (const [key, value] of Object.entries(this.logicalExpressionOperators)) {
      if (value == operator) return key as Bin["type"];
    }

    throw new Error(`Unknown logical operator: ${operator}`);
  }

  private static getUnaryExpressionOperator(operator: UnaryOperator): Unary["type"] {
    for (const [key, value] of Object.entries(this.unaryExpressionOperators)) {
      if (value == operator) return key as Unary["type"];
    }

    throw new Error(`Unknown unary operator: ${operator}`);
  }

  public static getCode(document: TextDocument, node: NodeWithParent<Node>, indent?: string): string {
    let code = "TODO";
    if (indent === undefined) indent = this.getNodeIndentation(node, document);

    return code.replace(/^/gm, `${indent}`); // Try to keep original indentation
  }

  public static getFirstParent<N extends Node, P extends Node>(node: NodeWithParent<N>, type: P["kind"][]): P | null {
    let parent = node.parent;
    while (parent && !(type as string[]).includes(parent.kind)) parent = parent.parent;

    return (parent as unknown as P) || null;
  }

  private static getLocFromRange(range: Range): Location {
    return {
      source: null,
      start: {
        line: range.start.line + 1,
        column: range.start.character,
        offset: 0,
      },
      end: {
        line: range.end.line + 1,
        column: range.end.character,
        offset: 0,
      },
    };
  }

  public static getNodeIndentation(node: NodeWithParent<Node>, document: TextDocument): string {
    const range = this.getNodeRange(node);
    const line = document.getText(new Range(range.start.line, 0, range.start.line, Infinity));

    return /^\s*/.exec(line)?.[0] ?? "";
  }

  public static getNodeRange(node: NodeWithParent<Node>): Range {
    if (!node.loc) return new Range(0, 0, 0, 0);

    const { start, end } = node.loc;
    return new Range(start.line - 1, start.column, end.line - 1, end.column);
  }

  public static isRangeForNode(selection: Range, node: NodeWithParent<Node>): boolean {
    if (selection.isEmpty) return this.isNodeIntersectingRange(node, selection);
    else return this.isRangeInNode(node, selection);
  }

  public static isNodeIntersectingRange(node: NodeWithParent<Node>, range: Range): boolean {
    return !!node.loc && !!range.intersection(this.getNodeRange(node));
  }

  public static isRangeInNode(node: NodeWithParent<Node>, range: Range): boolean {
    return !!node.loc && this.getNodeRange(node).contains(range);
  }

  public static getNodeKindFromSyntaxNode(
    node: UpdatedSyntaxNode<NodeWithParent<Node>>,
    locSource?: RefSyntaxNode<NodeWithParent<Node>>
  ): NodeWithParent<Node> {
    const { ref, changed, created, removed } = node;

    if (removed) return PHPParser.extendWithParent(new Noop(), node.ref?.parent);
    if (ref && !(changed || created)) return ref;

    if (node.type == SyntaxNodeType.IfStatement) {
      const { test, consequent, alternate, ref } = node as IfStatementUpdatedNode<NodeWithParent<If>>;
      if (ref) {
        if (test.changed || test.created) ref.test = this.getNodeKindFromSyntaxNode(test);

        const consequentNode = this.getNodeKindFromSyntaxNode(consequent) as NodeWithParent<Block>;
        const alternateNode = alternate && (this.getNodeKindFromSyntaxNode(alternate) as NodeWithParent<If | Block>);

        if (consequent?.removed) ref.destroy();
        else ref.body = consequentNode;

        if (alternate?.removed) ref.alternate?.destroy;
        else if (alternateNode) ref.alternate = alternateNode;
      }

      return (
        ref ??
        PHPParser.extendWithParent(
          new (If as AnyConstructor<If>)(
            this.getNodeKindFromSyntaxNode(test),
            consequent ? this.getNodeKindFromSyntaxNode(consequent) : new Noop(),
            alternate ? this.getNodeKindFromSyntaxNode(alternate) : undefined,
            false,
            undefined,
            locSource
              ? this.getLocFromRange(locSource.range)
              : node.range
              ? this.getLocFromRange(node.range)
              : undefined
          ),
          node.ref?.parent
        )
      );
    } else if (node.type == SyntaxNodeType.BinaryExpression) {
      const { left, right, operator } = node as BinaryExpressionUpdatedNode<NodeWithParent<Node>>;

      return PHPParser.extendWithParent(
        new (Bin as AnyConstructor<Bin>)(
          PHPParser.getBinaryExpressionOperator(operator),
          this.getNodeKindFromSyntaxNode(left),
          this.getNodeKindFromSyntaxNode(right),
          undefined,
          locSource ? this.getLocFromRange(locSource.range) : node.range ? this.getLocFromRange(node.range) : undefined
        ),
        node.ref?.parent
      );
    } else if (node.type == SyntaxNodeType.LogicalExpression) {
      const { left, right, operator } = node as LogicalExpressionUpdatedNode<NodeWithParent<Node>>;

      return PHPParser.extendWithParent(
        new (Bin as AnyConstructor<Bin>)(
          PHPParser.getLogicalExpressionOperator(operator),
          this.getNodeKindFromSyntaxNode(left),
          this.getNodeKindFromSyntaxNode(right),
          undefined,
          locSource ? this.getLocFromRange(locSource.range) : node.range ? this.getLocFromRange(node.range) : undefined
        ),
        node.ref?.parent
      );
    } else if (node.type == SyntaxNodeType.UnaryExpression) {
      const { argument, operator } = node as UnaryExpressionUpdatedNode<NodeWithParent<Node>>;

      // (type, what, docs, location)
      return PHPParser.extendWithParent(
        new (Unary as AnyConstructor<Unary>)(
          PHPParser.getUnaryExpressionOperator(operator),
          this.getNodeKindFromSyntaxNode(argument),
          locSource ? this.getLocFromRange(locSource.range) : node.range ? this.getLocFromRange(node.range) : undefined
        ),
        node.ref?.parent
      );
    } else if (node.type == SyntaxNodeType.ReturnStatement) {
      return PHPParser.extendWithParent(new (Return as AnyConstructor<Return>)(null), node.ref?.parent);
    } else if (node.type == SyntaxNodeType.BreakStatement) {
      return PHPParser.extendWithParent(new Break(), node.ref?.parent);
    } else if (node.type == SyntaxNodeType.ContinueStatement) {
      return PHPParser.extendWithParent(new Continue(), node.ref?.parent);
    } else if (node.type == SyntaxNodeType.Generic) {
      return node.ref ?? PHPParser.extendWithParent(new Noop());
    } else if (node.type == SyntaxNodeType.Empty) {
      return PHPParser.extendWithParent(new Noop(), node.ref?.parent);
    } else {
      throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  public static getSyntaxNodeFromNode(
    node: NodeWithParent<Node>,
    program: ProgramEntry,
    includeContext: true
  ): RefSyntaxNode<Node> & ExpressionContext<Node>;
  public static getSyntaxNodeFromNode(
    node: NodeWithParent<Node>,
    program: ProgramEntry,
    includeContext?: false
  ): RefSyntaxNode<Node>;
  public static getSyntaxNodeFromNode(
    node: NodeWithParent<Node>,
    program: ProgramEntry,
    includeContext = false
  ): RefSyntaxNode<Node> {
    const { parent } = node;
    const base = { ref: node, range: this.getNodeRange(node) };
    const context = includeContext
      ? {
          parent: parent ? this.getSyntaxNodeFromNode(parent, program) : null,
          root: this.getSyntaxNodeFromNode(
            this.getFirstParent(node, PHPParser.guardClauseParentTypes) ?? program.program,
            program
          ),
        }
      : {};
    let operator;

    switch (node.kind) {
      case "IfStatement":
        const ifNode: IfStatementRefNode<Node> = {
          ...base,
          ...context,
          type: SyntaxNodeType.IfStatement,
          test: this.getSyntaxNodeFromNode((node as NodeWithParent<If>).test, program),
          consequent: this.getSyntaxNodeFromNode((node as NodeWithParent<If>).body, program),
          alternate: (node as NodeWithParent<If>).alternate
            ? this.getSyntaxNodeFromNode((node as NodeWithParent<If>).alternate!, program)
            : undefined,
        };
        return ifNode;
      case "BinaryExpression":
        operator = PHPParser.binaryExpressionOperators[(node as NodeWithParent<Bin>).type];
        if (!operator) return { type: SyntaxNodeType.Generic, ...base };
        const binaryNode: BinaryExpressionRefNode<Node> = {
          ...base,
          ...context,
          type: SyntaxNodeType.BinaryExpression,
          left: this.getSyntaxNodeFromNode((node as NodeWithParent<Bin>).left, program),
          right: this.getSyntaxNodeFromNode((node as NodeWithParent<Bin>).right, program),
          operator,
        };
        return binaryNode;
      case "LogicalExpression":
        operator = PHPParser.logicalExpressionOperators[(node as NodeWithParent<Bin>).type];
        if (!operator) return { type: SyntaxNodeType.Generic, ...base };
        const logicalNode: LogicalExpressionRefNode<Node> = {
          ...base,
          ...context,
          type: SyntaxNodeType.LogicalExpression,
          left: this.getSyntaxNodeFromNode((node as NodeWithParent<Bin>).left, program),
          right: this.getSyntaxNodeFromNode((node as NodeWithParent<Bin>).right, program),
          operator,
        };
        return logicalNode;
      case "UnaryExpression":
        operator = PHPParser.unaryExpressionOperators[(node as NodeWithParent<Unary>).type];
        if (!operator) return { type: SyntaxNodeType.Generic, ...base };
        const unaryNode: UnaryExpressionRefNode<Node> = {
          ...base,
          ...context,
          type: SyntaxNodeType.UnaryExpression,
          argument: this.getSyntaxNodeFromNode((node as NodeWithParent<Unary>).what, program),
          operator,
        };
        return unaryNode;
      case "FunctionDeclaration":
      case "FunctionExpression":
      case "ArrowFunctionExpression":
        const functionNode: FunctionDeclarationRefNode<Node> = {
          ...base,
          ...context,
          type: SyntaxNodeType.FunctionDeclaration,
          ref: node,
        };
        return functionNode;
      case "DoWhileStatement":
        const doWhileNode: DoWhileStatementRefNode<Node> = {
          ...base,
          ...context,
          type: SyntaxNodeType.DoWhileStatement,
          test: this.getSyntaxNodeFromNode((node as NodeWithParent<Do>).test, program),
        };
        return doWhileNode;
      case "WhileStatement":
        const whileNode: WhileStatementRefNode<Node> = {
          ...base,
          ...context,
          type: SyntaxNodeType.WhileStatement,
          test: this.getSyntaxNodeFromNode((node as NodeWithParent<While>).test, program),
        };
        return whileNode;
      case "ForStatement":
        const forNode: ForStatementRefNode<Node> = {
          ...base,
          ...context,
          type: SyntaxNodeType.ForStatement,
          test: (node as NodeWithParent<For>).test
            ? this.getSyntaxNodeFromNode((node as NodeWithParent<For>).test[0], program)
            : { type: SyntaxNodeType.Empty, ...base },
        };
        return forNode;
      case "ReturnStatement":
        const returnNode: GeneralStatementRefNode<Node> = {
          ...base,
          ...context,
          type: SyntaxNodeType.ReturnStatement,
          argument: (node as NodeWithParent<Return>).expr
            ? this.getSyntaxNodeFromNode((node as NodeWithParent<Return>).expr!, program)
            : undefined,
        };
        return returnNode;
      case "BreakStatement":
        const breakNode: GeneralStatementRefNode<Node> = {
          type: SyntaxNodeType.BreakStatement,
          ...base,
          ...context,
        };
        return breakNode;
      case "ContinueStatement":
        const continueNode: GeneralStatementRefNode<Node> = {
          ...base,
          ...context,
          type: SyntaxNodeType.ContinueStatement,
        };
        return continueNode;
      default:
        const generic: GenericRefNode<Node> = {
          ...base,
          ...context,
          type: SyntaxNodeType.Generic,
        };
        return generic;
    }
  }

  public static removeInitialIndent(document: TextDocument, range: Range, code: string): string {
    const initialIndent =
      document.getText(new Range(range.start.line, 0, range.start.line, range.start.character)).match(/^\s*/)?.[0] ??
      "";

    if (initialIndent) return code.replace(new RegExp(`^${initialIndent}`), "");
    else return code;
  }

  private static isNode(node: any): node is Node {
    return "kind" in node;
  }

  private static extendWithParent<T extends Node>(
    node: T,
    parent: NodeWithParent<Node> | null = null
  ): NodeWithParent<T> {
    (node as NodeWithParent<T>).parent = parent;

    for (const key of Object.keys(node) as (keyof T)[]) {
      if (PHPParser.isNode(node[key])) {
        (node[key] as Node) = this.extendWithParent(node[key] as Node, node as NodeWithParent<T>);
        (node[key] as NodeWithParent<Node>).pathName = key as string;
      }
    }

    return node as NodeWithParent<T>;
  }

  private parser: Engine;

  public constructor(version?: `${5 | 6 | 7 | 8}.${number}`) {
    const options: ConstructorParameters<typeof Engine>[0] = {
      parser: { locations: true, suppressErrors: true },
      ast: { withPositions: true, withSource: true },
    };
    if (version) options.parser.version = version;

    this.parser = new Engine(options);
  }

  public parseDocument(document: TextDocument): ProgramEntry {
    const { version, getText } = document;

    return {
      version,
      program: this.parseText(getText(), document.fileName),
    };
  }

  public parseText(code: string, filename: string): NodeWithParent<Program> {
    const ast = this.parser.parseCode(code, filename);

    return PHPParser.extendWithParent(ast);
  }
}
