import { NodePath as NodePathInstance, visit } from "ast-types";
import {
  BinaryExpressionKind,
  BlockStatementKind,
  CommentKind,
  ExpressionKind,
  FileKind,
  LogicalExpressionKind,
  NodeKind,
  SourceLocationKind,
  StatementKind,
  UnaryExpressionKind,
} from "ast-types/lib/gen/kinds";
import { NodePath } from "ast-types/lib/node-path";
import { parse, print, types } from "recast";
import { Range } from "vscode";
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
  rangeToGlobal,
  RefSyntaxNode,
  SyntaxNodeType,
  UnaryExpressionRefNode,
  UnaryExpressionUpdatedNode,
  UnaryOperator,
  UpdatedSyntaxNode,
  WhileStatementRefNode,
} from "vscode-invert-if";
import { ProgramEntry } from "./ProgramEntry";

export default class JavaScriptParser {
  private static guardClauseParentTypes: NodeKind["type"][] = [
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
  private static binaryExpressionOperators: Partial<Record<BinaryExpressionKind["operator"], BinaryOperator>> = {
    "==": BinaryOperator.Equal,
    "!=": BinaryOperator.NotEqual,
    "===": BinaryOperator.StrictEqual,
    "!==": BinaryOperator.StrictNotEqual,
    "<": BinaryOperator.LessThan,
    "<=": BinaryOperator.LessThanOrEqual,
    ">": BinaryOperator.GreaterThan,
    ">=": BinaryOperator.GreaterThanOrEqual,
  };
  private static logicalExpressionOperators: Partial<Record<LogicalExpressionKind["operator"], LogicalOperator>> = {
    "||": LogicalOperator.Or,
    "&&": LogicalOperator.And,
    "??": LogicalOperator.NullishCoalescing,
  };
  private static unaryExpressionOperators: Partial<Record<UnaryExpressionKind["operator"], UnaryOperator>> = {
    "!": UnaryOperator.Not,
    "+": UnaryOperator.Positive,
    "-": UnaryOperator.Negative,
  };

  public static getBlockCode(path: NodePath, context: DocumentContext, indent?: string): string {
    if (indent === undefined) indent = this.getNodeIndentation(path.node, context);
    const body = this.getBody(path)?.node.body;

    return body?.map((node) => this.getCode(node, context, indent)).join("\n") ?? "";
  }

  public static getBlockIndentation(node: NodePath, context: DocumentContext): string {
    const body = this.getBody(node);
    const firstStatement = body?.node.body[0];

    return firstStatement ? this.getNodeIndentation(firstStatement, context) : "";
  }

  public static getBlockRange(node: NodePath): Range {
    const body = this.getBody(node);
    const start = body?.node.body[0]?.loc?.start ?? body?.node.loc?.start;
    const end = body?.node.body[body.node.body.length - 1]?.loc?.end ?? body?.node.loc?.end;

    if (!start || !end) return new Range(0, 0, 0, 0);

    return new Range(start.line - 1, start.column, end.line - 1, end.column);
  }

  private static getBinaryExpressionOperator(operator: BinaryOperator): BinaryExpressionKind["operator"] {
    for (const [key, value] of Object.entries(this.binaryExpressionOperators)) {
      if (value == operator) return key as BinaryExpressionKind["operator"];
    }

    throw new Error(`Unknown binary operator: ${operator}`);
  }

  private static getLogicalExpressionOperator(operator: LogicalOperator): LogicalExpressionKind["operator"] {
    for (const [key, value] of Object.entries(this.logicalExpressionOperators)) {
      if (value == operator) return key as LogicalExpressionKind["operator"];
    }

    throw new Error(`Unknown logical operator: ${operator}`);
  }

  private static getUnaryExpressionOperator(operator: UnaryOperator): UnaryExpressionKind["operator"] {
    for (const [key, value] of Object.entries(this.unaryExpressionOperators)) {
      if (value == operator) return key as UnaryExpressionKind["operator"];
    }

    throw new Error(`Unknown unary operator: ${operator}`);
  }

  public static getBody<S extends NodeKind>(path: NodePath<S>): NodePath<BlockStatementKind> | null {
    let body = path.get("body");
    while (body?.value && "body" in body.value) body = body.get("body");

    return body;
  }

  public static getCode(node: NodeKind, context: DocumentContext, indent?: string): string {
    let code = print(node).code;
    if (indent === undefined) indent = this.getNodeIndentation(node, context);

    return code.replace(/^/gm, `${indent}`); // Try to keep original indentation
  }

  public static getFirstParent<N extends NodeKind, P extends NodeKind>(
    path: NodePath<N>,
    type: P["type"][]
  ): NodePath<P> | null {
    let parent: NodePath<P> | undefined = path.parent;
    while (parent && !(type as string[]).includes(parent.node.type)) parent = parent.parent;

    return parent || null;
  }

  private static getLocFromRange(range: Range): SourceLocationKind {
    return {
      start: {
        line: range.start.line + 1,
        column: range.start.character,
      },
      end: {
        line: range.end.line + 1,
        column: range.end.character,
      },
    };
  }

  public static getNodeIndentation(node: NodeKind, context: DocumentContext): string {
    const range = this.getNodeRange(node);
    const line = context.document.getText(
      rangeToGlobal(new Range(range.start.line, 0, range.start.line, Infinity), context)
    );

    return /^\s*/.exec(line)?.[0] ?? "";
  }

  public static getNodeRange(node: NodeKind | CommentKind): Range {
    if (!node.loc) return new Range(0, 0, 0, 0);

    const { start, end } = node.loc;
    const base = new Range(start.line - 1, start.column, end.line - 1, end.column);

    if ("comments" in node) {
      const commentRang = node.comments?.reduce((range, comment) => range.union(this.getNodeRange(comment)), base);
      return commentRang ?? base;
    }

    return base;
  }

  public static isRangeForNode(selection: Range, node: NodeKind): boolean {
    if (selection.isEmpty) return this.isNodeIntersectingRange(node, selection);
    else return this.isRangeInNode(node, selection);
  }

  public static isNodeIntersectingRange(node: NodeKind, range: Range): boolean {
    return !!node.loc && !!range.intersection(this.getNodeRange(node));
  }

  public static isRangeInNode(node: NodeKind, range: Range): boolean {
    return !!node.loc && this.getNodeRange(node).contains(range);
  }

  public static getNodeKindFromSyntaxNode(
    node: UpdatedSyntaxNode<NodePath<NodeKind>>,
    locSource?: RefSyntaxNode<NodePath<NodeKind>>
  ): NodeKind {
    if (node.removed) return types.builders.noop();

    const { ref, changed, created } = node;
    if (ref && !(changed || created)) return ref.node;

    if (node.type == SyntaxNodeType.IfStatement) {
      const { test, consequent, alternate } = node as IfStatementUpdatedNode<NodePath<NodeKind>>;
      if (ref) {
        if (test?.removed) ref.get("test").prune();
        else if (test.changed || test.created) ref.get("test").replace(this.getNodeKindFromSyntaxNode(test));

        const consequentNode = this.getNodeKindFromSyntaxNode(consequent);
        const alternateNode = alternate && this.getNodeKindFromSyntaxNode(alternate);

        if (consequent?.removed) ref.get("consequent").prune();
        else ref.get("consequent").replace(consequentNode);

        if (alternate?.removed) ref.get("alternate").prune();
        else if (alternateNode) ref.get("alternate").replace(alternateNode);
      }

      return (
        ref?.node ??
        types.builders.ifStatement.from({
          test: this.getNodeKindFromSyntaxNode(test) as ExpressionKind,
          consequent: consequent
            ? (this.getNodeKindFromSyntaxNode(consequent) as StatementKind)
            : types.builders.noop(),
          alternate: alternate ? (this.getNodeKindFromSyntaxNode(alternate) as StatementKind) : null,
          loc: locSource ? this.getLocFromRange(locSource.range) : node.range ? this.getLocFromRange(node.range) : null,
        })
      );
    } else if (node.type == SyntaxNodeType.BinaryExpression) {
      const { left, right, operator } = node as BinaryExpressionUpdatedNode<NodePath<NodeKind>>;

      const newExpression: BinaryExpressionKind = types.builders.binaryExpression.from({
        operator: JavaScriptParser.getBinaryExpressionOperator(operator),
        left: this.getNodeKindFromSyntaxNode(left) as ExpressionKind,
        right: this.getNodeKindFromSyntaxNode(right) as ExpressionKind,
        loc: locSource ? this.getLocFromRange(locSource.range) : node.range ? this.getLocFromRange(node.range) : null,
      });

      if (ref) ref.replace(newExpression);

      return ref?.node ?? newExpression;
    } else if (node.type == SyntaxNodeType.LogicalExpression) {
      const { left, right, operator } = node as LogicalExpressionUpdatedNode<NodePath<NodeKind>>;

      const newExpression: LogicalExpressionKind = types.builders.logicalExpression.from({
        operator: JavaScriptParser.getLogicalExpressionOperator(operator),
        left: this.getNodeKindFromSyntaxNode(left) as ExpressionKind,
        right: this.getNodeKindFromSyntaxNode(right) as ExpressionKind,
        loc: locSource ? this.getLocFromRange(locSource.range) : node.range ? this.getLocFromRange(node.range) : null,
      });

      if (ref) ref.replace(newExpression);

      return ref?.node ?? newExpression;
    } else if (node.type == SyntaxNodeType.UnaryExpression) {
      const { argument, operator } = node as UnaryExpressionUpdatedNode<NodePath<NodeKind>>;

      const newExpression: UnaryExpressionKind = types.builders.unaryExpression.from({
        operator: JavaScriptParser.getUnaryExpressionOperator(operator),
        argument: this.getNodeKindFromSyntaxNode(argument) as ExpressionKind,
        loc: locSource ? this.getLocFromRange(locSource.range) : node.range ? this.getLocFromRange(node.range) : null,
      });

      if (ref) ref.replace(newExpression);

      return ref?.node ?? newExpression;
    } else if (node.type == SyntaxNodeType.ReturnStatement) {
      return types.builders.returnStatement(null);
    } else if (node.type == SyntaxNodeType.BreakStatement) {
      return types.builders.breakStatement();
    } else if (node.type == SyntaxNodeType.ContinueStatement) {
      return types.builders.continueStatement();
    } else if (node.type == SyntaxNodeType.Generic) {
      return node.ref?.node ?? types.builders.noop();
    } else if (node.type == SyntaxNodeType.Empty) {
      return types.builders.noop();
    } else {
      throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  public static getSyntaxNodeFromPath(
    path: NodePath<NodeKind>,
    program: ProgramEntry,
    includeContext: true
  ): RefSyntaxNode<NodePath<NodeKind>> & ExpressionContext<NodePath<NodeKind>>;
  public static getSyntaxNodeFromPath(
    path: NodePath<NodeKind>,
    program: ProgramEntry,
    includeContext?: false
  ): RefSyntaxNode<NodePath<NodeKind>>;
  public static getSyntaxNodeFromPath(
    path: NodePath<NodeKind>,
    program: ProgramEntry,
    includeContext = false
  ): RefSyntaxNode<NodePath<NodeKind>> {
    const { node, parent } = path;
    const base = { ref: path, range: this.getNodeRange(node) };
    const context = includeContext
      ? {
          parent: this.getSyntaxNodeFromPath(parent, program),
          root: this.getSyntaxNodeFromPath(
            this.getFirstParent(path, JavaScriptParser.guardClauseParentTypes) ?? program.root,
            program
          ),
        }
      : {};
    let operator;

    switch (node.type) {
      case "IfStatement":
        const ifNode: IfStatementRefNode<NodePath<NodeKind>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.IfStatement,
          test: this.getSyntaxNodeFromPath(new NodePathInstance(node.test, path), program),
          consequent: this.getSyntaxNodeFromPath(new NodePathInstance(node.consequent, path), program),
          alternate: node.alternate
            ? this.getSyntaxNodeFromPath(new NodePathInstance(node.alternate, path), program)
            : undefined,
        };
        return ifNode;
      case "BinaryExpression":
        operator = JavaScriptParser.binaryExpressionOperators[node.operator];
        if (!operator) return { type: SyntaxNodeType.Generic, ...base };
        const binaryNode: BinaryExpressionRefNode<NodePath<NodeKind>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.BinaryExpression,
          left: this.getSyntaxNodeFromPath(path.get("left"), program),
          right: this.getSyntaxNodeFromPath(path.get("right"), program),
          operator,
        };
        return binaryNode;
      case "LogicalExpression":
        operator = JavaScriptParser.logicalExpressionOperators[node.operator];
        if (!operator) return { type: SyntaxNodeType.Generic, ...base };
        const logicalNode: LogicalExpressionRefNode<NodePath<NodeKind>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.LogicalExpression,
          left: this.getSyntaxNodeFromPath(path.get("left"), program),
          right: this.getSyntaxNodeFromPath(path.get("right"), program),
          operator,
        };
        return logicalNode;
      case "UnaryExpression":
        operator = JavaScriptParser.unaryExpressionOperators[node.operator];
        if (!operator) return { type: SyntaxNodeType.Generic, ...base };
        const unaryNode: UnaryExpressionRefNode<NodePath<NodeKind>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.UnaryExpression,
          argument: this.getSyntaxNodeFromPath(path.get("argument"), program),
          operator,
        };
        return unaryNode;
      case "FunctionDeclaration":
      case "FunctionExpression":
      case "ArrowFunctionExpression":
        const functionNode: FunctionDeclarationRefNode<NodePath<NodeKind>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.FunctionDeclaration,
          ref: path,
        };
        return functionNode;
      case "DoWhileStatement":
        const doWhileNode: DoWhileStatementRefNode<NodePath<NodeKind>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.DoWhileStatement,
          test: this.getSyntaxNodeFromPath(path.get("test"), program),
        };
        return doWhileNode;
      case "WhileStatement":
        const whileNode: WhileStatementRefNode<NodePath<NodeKind>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.WhileStatement,
          test: this.getSyntaxNodeFromPath(path.get("test"), program),
        };
        return whileNode;
      case "ForStatement":
        const forNode: ForStatementRefNode<NodePath<NodeKind>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.ForStatement,
          test: path.get("test")
            ? this.getSyntaxNodeFromPath(path.get("test"), program)
            : { type: SyntaxNodeType.Empty, ...base },
        };
        return forNode;
      case "ReturnStatement":
        const returnNode: GeneralStatementRefNode<NodePath<NodeKind>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.ReturnStatement,
          argument: path.get("argument") ? this.getSyntaxNodeFromPath(path.get("argument"), program) : undefined,
        };
        return returnNode;
      case "BreakStatement":
        const breakNode: GeneralStatementRefNode<NodePath<NodeKind>> = {
          type: SyntaxNodeType.BreakStatement,
          ...base,
          ...context,
        };
        return breakNode;
      case "ContinueStatement":
        const continueNode: GeneralStatementRefNode<NodePath<NodeKind>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.ContinueStatement,
        };
        return continueNode;
      default:
        const generic: GenericRefNode<NodePath<NodeKind>> = {
          ...base,
          ...context,
          type: SyntaxNodeType.Generic,
        };
        return generic;
    }
  }

  public static removeInitialIndent(range: Range, context: DocumentContext, code: string): string {
    const globalRange = rangeToGlobal(new Range(range.start.line, 0, range.start.line, range.start.character), context);
    const initialIndent = context.document.getText(rangeToGlobal(globalRange, context)).match(/^\s*/)?.[0] ?? "";

    if (initialIndent) return code.replace(new RegExp(`^${initialIndent}`), "");
    else return code;
  }

  protected parser: { parse: () => NodeKind };

  public constructor(language: string) {
    switch (language) {
      case "typescript":
      case "typescriptreact":
      case "ts":
        this.parser = require("recast/parsers/babel-ts");
        break;
      case "flow":
        this.parser = require("recast/parsers/flow");
        break;
      case "babylon":
        this.parser = require("recast/parsers/babylon");
        break;
      case "javascript":
      case "js":
      default:
        this.parser = require("recast/parsers/acorn");
        break;
    }
  }

  public parseDocumentContext({ document, embeddedRange }: DocumentContext): ProgramEntry {
    const { version, getText } = document;
    const program: Partial<ProgramEntry> = {
      version,
      programNode: this.parseText(getText(embeddedRange)),
    };

    visit(program.programNode!, {
      visitProgram(path) {
        program.root = path;
        return false;
      },
    });

    return program as ProgramEntry;
  }

  public parseText(code: string): FileKind {
    return parse(code, { parser: this.parser });
  }
}
