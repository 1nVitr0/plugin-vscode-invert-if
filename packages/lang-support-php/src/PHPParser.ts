import { AST, Bin, Block, Engine, If, Location, Node, Noop, Program, Unary } from "php-parser";
import { Range, TextDocument } from "vscode";
import {
  BinaryExpressionRefNode,
  BinaryExpressionUpdatedNode,
  BinaryOperator,
  DocumentContext,
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
import unparse = require("php-unparser");

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
  private static logicalOperatorPrecedence: (LogicalOperator | UnaryOperator)[] = [
    UnaryOperator.Not,
    LogicalOperator.And,
    LogicalOperator.Or,
    LogicalOperator.NullishCoalescing,
  ];

  private static ast = AST.prototype as unknown as Record<string, AnyConstructor<Node>>;

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

  public static getCode(document: TextDocument, node: NodeWithParent<Node>, indent?: string): string {
    let code = "TODO";
    if (indent === undefined) indent = this.getNodeIndentation(node, document);

    return code.replace(/^/gm, `${indent}`); // Try to keep original indentation
  }

  public static getFirstParent<N extends Node, P extends Node>(
    node: NodeWithParent<N>,
    type: P["kind"][]
  ): NodeWithParent<P> | null {
    let parent = node.parent;
    while (parent && !(type as string[]).includes(parent.kind)) parent = parent.parent;

    return (parent as unknown as NodeWithParent<P>) || null;
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

  public static getNodeFromSyntaxNode(
    node: UpdatedSyntaxNode<NodeWithParent<Node>>,
    locSource?: RefSyntaxNode<NodeWithParent<Node>>
  ): NodeWithParent<Node> {
    const { ref, changed, created, removed } = node;

    if (removed) return PHPParser.extendWithParent(new Noop(), node.ref?.parent);
    if (ref && !(changed || created)) return ref;

    if (node.type == SyntaxNodeType.IfStatement) {
      const { test, consequent, alternate, ref } = node as IfStatementUpdatedNode<NodeWithParent<If>>;
      if (ref) {
        if (test.changed || test.created) ref.test = this.getNodeFromSyntaxNode(test);

        const consequentNode = this.getNodeFromSyntaxNode(consequent) as NodeWithParent<Block>;
        const alternateNode = alternate && (this.getNodeFromSyntaxNode(alternate) as NodeWithParent<If | Block>);

        if (consequent?.removed) ref.destroy();
        else ref.body = consequentNode;

        if (alternate?.removed) ref.alternate?.destroy;
        else if (alternateNode) ref.alternate = alternateNode;
      }

      return (
        ref ??
        PHPParser.extendWithParent(
          new this.ast.if(
            this.getNodeFromSyntaxNode(test),
            consequent ? this.getNodeFromSyntaxNode(consequent) : new Noop(),
            alternate ? this.getNodeFromSyntaxNode(alternate) : undefined,
            false,
            undefined,
            locSource
              ? this.getLocFromRange(locSource.range)
              : node.range
              ? this.getLocFromRange(node.range)
              : undefined
          ),
          node.ref?.parent,
          false
        )
      );
    } else if (node.type == SyntaxNodeType.BinaryExpression) {
      const { left, right, operator } = node as BinaryExpressionUpdatedNode<NodeWithParent<Node>>;

      return PHPParser.extendWithParent(
        new this.ast.bin(
          PHPParser.getBinaryExpressionOperator(operator),
          this.getNodeFromSyntaxNode(left),
          this.getNodeFromSyntaxNode(right),
          undefined,
          locSource ? this.getLocFromRange(locSource.range) : node.range ? this.getLocFromRange(node.range) : undefined
        ),
        node.ref?.parent,
        false
      );
    } else if (node.type == SyntaxNodeType.LogicalExpression) {
      const { left, right, operator } = node as LogicalExpressionUpdatedNode<NodeWithParent<Node>>;

      return PHPParser.extendWithParent(
        new this.ast.bin(
          PHPParser.getLogicalExpressionOperator(operator),
          this.getNodeFromSyntaxNode(left),
          this.getNodeFromSyntaxNode(right),
          undefined,
          locSource ? this.getLocFromRange(locSource.range) : node.range ? this.getLocFromRange(node.range) : undefined
        ),
        node.ref?.parent,
        false
      );
    } else if (node.type == SyntaxNodeType.UnaryExpression) {
      const { argument, operator } = node as UnaryExpressionUpdatedNode<NodeWithParent<Node>>;

      // (type, what, docs, location)
      return PHPParser.extendWithParent(
        new this.ast.unary(
          PHPParser.getUnaryExpressionOperator(operator),
          this.getNodeFromSyntaxNode(argument),
          locSource ? this.getLocFromRange(locSource.range) : node.range ? this.getLocFromRange(node.range) : undefined
        ),
        node.ref?.parent,
        false
      );
    } else if (node.type == SyntaxNodeType.ReturnStatement) {
      return PHPParser.extendWithParent(new this.ast.return(null), node.ref?.parent, false);
    } else if (node.type == SyntaxNodeType.BreakStatement) {
      return PHPParser.extendWithParent(new this.ast.break(), node.ref?.parent, false);
    } else if (node.type == SyntaxNodeType.ContinueStatement) {
      return PHPParser.extendWithParent(new this.ast.continue(), node.ref?.parent, false);
    } else if (node.type == SyntaxNodeType.Generic) {
      return node.ref ?? PHPParser.extendWithParent(new this.ast.noop(), null, false);
    } else if (node.type == SyntaxNodeType.Empty) {
      return PHPParser.extendWithParent(new this.ast.noop(), node.ref?.parent, false);
    } else {
      throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  public static getSyntaxNodeFromNode<N extends Node>(
    node: NodeWithParent<N>,
    program: ProgramEntry,
    includeContext: true
  ): RefSyntaxNode<NodeWithParent<N>> & ExpressionContext<NodeWithParent<N>>;
  public static getSyntaxNodeFromNode<N extends Node>(
    node: NodeWithParent<N>,
    program: ProgramEntry,
    includeContext?: false
  ): RefSyntaxNode<NodeWithParent<N>>;
  public static getSyntaxNodeFromNode<N extends Node>(
    node: NodeWithParent<N>,
    program: ProgramEntry,
    includeContext = false
  ): RefSyntaxNode<NodeWithParent<N>> {
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
      case "if":
        const ifNode: IfStatementRefNode<NodeWithParent<N>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.IfStatement,
          test: this.getSyntaxNodeFromNode((node as any).test, program),
          consequent: this.getSyntaxNodeFromNode((node as any).body, program),
          alternate: (node as any).alternate ? this.getSyntaxNodeFromNode((node as any).alternate, program) : undefined,
        };
        return ifNode;
      case "bin":
        operator = Object.values(this.logicalExpressionOperators).includes((node as any).type)
          ? PHPParser.logicalExpressionOperators[(node as any).type]
          : PHPParser.binaryExpressionOperators[(node as any).type];
        if (!operator) return { type: SyntaxNodeType.Generic, ...base };
        return {
          ...base,
          ...context,
          type: Object.values(LogicalOperator).includes(operator as LogicalOperator)
            ? SyntaxNodeType.LogicalExpression
            : SyntaxNodeType.BinaryExpression,
          left: this.getSyntaxNodeFromNode((node as any).left, program),
          right: this.getSyntaxNodeFromNode((node as any).right, program),
          operator,
        } as BinaryExpressionRefNode<NodeWithParent<N>> | LogicalExpressionRefNode<NodeWithParent<N>>;
      case "unary":
        operator = PHPParser.unaryExpressionOperators[(node as any).type];
        if (!operator) return { type: SyntaxNodeType.Generic, ...base };
        const unaryNode: UnaryExpressionRefNode<NodeWithParent<N>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.UnaryExpression,
          argument: this.getSyntaxNodeFromNode((node as any).what, program),
          operator,
        };
        return unaryNode;
      case "function":
        const functionNode: FunctionDeclarationRefNode<NodeWithParent<N>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.FunctionDeclaration,
          ref: node,
        };
        return functionNode;
      case "do":
        const doWhileNode: DoWhileStatementRefNode<NodeWithParent<N>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.DoWhileStatement,
          test: this.getSyntaxNodeFromNode((node as any).test, program),
        };
        return doWhileNode;
      case "while":
        const whileNode: WhileStatementRefNode<NodeWithParent<N>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.WhileStatement,
          test: this.getSyntaxNodeFromNode((node as any).test, program),
        };
        return whileNode;
      case "for":
        const forNode: ForStatementRefNode<NodeWithParent<N>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.ForStatement,
          test: (node as any).test
            ? this.getSyntaxNodeFromNode((node as any).test[0], program)
            : { type: SyntaxNodeType.Empty, ...base },
        };
        return forNode;
      case "return":
        const returnNode: GeneralStatementRefNode<NodeWithParent<N>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.ReturnStatement,
          argument: (node as any).expr ? this.getSyntaxNodeFromNode((node as any).expr, program) : undefined,
        };
        return returnNode;
      case "break":
        const breakNode: GeneralStatementRefNode<NodeWithParent<N>> = {
          type: SyntaxNodeType.BreakStatement,
          ...base,
          ...context,
        };
        return breakNode;
      case "continue":
        const continueNode: GeneralStatementRefNode<NodeWithParent<N>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.ContinueStatement,
        };
        return continueNode;
      default:
        const generic: GenericRefNode<NodeWithParent<N>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.Generic,
        };
        return generic;
    }
  }

  public static visit<N extends Node>(root: Node, visitKinds: Record<Node["kind"], (node: N) => void | boolean>) {
    const stack: Node[] = [root];
    while (stack.length) {
      const current = stack.pop()!;
      for (const node of Object.values(current)) {
        if (PHPParser.isNode(node)) {
          stack.push(node);
        } else if (node instanceof Array) {
          for (const child of node) {
            if (PHPParser.isNode(child)) stack.push(child);
          }
        }
      }

      if (visitKinds[current.kind]) {
        const result = visitKinds[current.kind](current as N);
        if (result === false) return;
      }
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
    return node && typeof node === "object" && "kind" in node;
  }

  private static extendWithParent<T extends Node>(
    node: T,
    parent: NodeWithParent<Node> | null = null,
    recursive = true
  ): NodeWithParent<T> {
    (node as NodeWithParent<T>).parent = parent;

    if (recursive) {
      for (const key of Object.keys(node) as (keyof T)[]) {
        if (PHPParser.isNode(node[key])) {
          (node[key] as Node) = this.extendWithParent(node[key] as Node, node as NodeWithParent<T>);
          (node[key] as Node as NodeWithParent<Node>).pathName = key as string;
        }
      }
    }

    return node as NodeWithParent<T>;
  }

  private static createASTNode<N extends typeof Node, R extends Node>(base: N, ...args: any[]): R {
    const node = Object.create(base.prototype);
    base.apply(node, args as []);
    return node;
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

  public parseDocumentContext({document, embeddedRange}: DocumentContext): ProgramEntry {
    const { version, getText } = document;

    return {
      version,
      program: this.parseText(getText(embeddedRange), document.fileName),
    };
  }

  public parseText(code: string, filename: string): NodeWithParent<Program> {
    const ast = this.parser.parseCode(code, filename);

    return PHPParser.extendWithParent(ast);
  }

  public stringifyNode(
    node: UpdatedSyntaxNode<NodeWithParent<Node>>,
    document: TextDocument,
    precedingOperator?: LogicalOperator | UnaryOperator
  ): string {
    const { changed, created, removed, ref, range } = node;

    if (removed) return "";
    if (!changed && !created) return ref?.loc?.source ?? range ? document.getText(range) : "";

    return unparse(PHPParser.getNodeFromSyntaxNode(node));
  }
}
