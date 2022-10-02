import { NodePath as NodePathInstance, visit } from "ast-types";
import {
  BinaryExpressionKind,
  BlockStatementKind,
  CommentKind,
  ExpressionKind,
  FileKind,
  ForStatementKind,
  IfStatementKind,
  LogicalExpressionKind,
  NodeKind,
  ProgramKind,
  SourceLocationKind,
  StatementKind,
  UnaryExpressionKind,
} from "ast-types/gen/kinds";
import { NodePath } from "ast-types/lib/node-path";
import { SharedContextMethods } from "ast-types/lib/path-visitor";
import { parse, prettyPrint, print, types } from "recast";
import { Position, Range, TextDocument, TextEditorEdit, Uri } from "vscode";
import { isUnaryExpressionNode } from "../../api/nodes/ConditionNode";
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
  GuardClauseProvider,
  IfStatementRefNode,
  IfStatementUpdatedNode,
  InvertConditionProvider,
  InvertIfElseProvider,
  isBinaryExpressionNode,
  isForNode,
  isIfStatementNode,
  isLogicalExpressionNode,
  isLoopNode,
  isRefNode,
  LogicalExpressionRefNode,
  LogicalExpressionUpdatedNode,
  LogicalOperator,
  LoopRefNode,
  RefSyntaxNode,
  SyntaxNodeType,
  UnaryExpressionRefNode,
  UnaryExpressionUpdatedNode,
  UnaryOperator,
  UpdatedSyntaxNode,
  WhileStatementRefNode,
} from "../../api";

type NP = NodePath<NodeKind>;
interface ProgramEntry {
  version: number;
  programNode: FileKind;
  root: NodePath<ProgramKind>;
}

export default class TypeScriptInvertIfProvider
  implements InvertConditionProvider<NP>, InvertIfElseProvider<NP>, GuardClauseProvider<NP>
{
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
  protected static replaceTrueParentStatement: NodeKind["type"][] = [
    "WhileStatement",
    "DoWhileStatement",
    "ForStatement",
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

  private parsers: Map<string, { parse: () => NodeKind }> = new Map();
  private programs: Map<Uri, ProgramEntry> = new Map();

  private static reverseBinaryExpressionOperator(operator: BinaryOperator): BinaryExpressionKind["operator"] {
    for (const [key, value] of Object.entries(this.binaryExpressionOperators)) {
      if (value == operator) return key as BinaryExpressionKind["operator"];
    }

    throw new Error(`Unknown binary operator: ${operator}`);
  }

  private static reverseLogicalExpressionOperator(operator: LogicalOperator): LogicalExpressionKind["operator"] {
    for (const [key, value] of Object.entries(this.logicalExpressionOperators)) {
      if (value == operator) return key as LogicalExpressionKind["operator"];
    }

    throw new Error(`Unknown logical operator: ${operator}`);
  }

  private static reverseUnaryExpressionOperator(operator: UnaryOperator): UnaryExpressionKind["operator"] {
    for (const [key, value] of Object.entries(this.unaryExpressionOperators)) {
      if (value == operator) return key as UnaryExpressionKind["operator"];
    }

    throw new Error(`Unknown unary operator: ${operator}`);
  }

  public provideConditions(document: TextDocument, range?: Range): (RefSyntaxNode<NP> & ExpressionContext<NP>)[] {
    const self = this;
    const program = this.parseDocument(document);
    const conditions: NodePath<ExpressionKind>[] = [];

    function addCondition(this: SharedContextMethods, path: NodePath<StatementKind & { test: any }>) {
      const test = path.get("test");
      if (test && (!range || self.selectionIsForNode(range, test.node))) {
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

    return conditions.map((statement) => this.mapToSyntaxNode(statement, program, true));
  }

  public async resolveCondition(
    condition: RefSyntaxNode<NP> & ExpressionContext<NP>
  ): Promise<RefSyntaxNode<NP> & ExpressionContext<NP>> {
    return this.resolveSyntaxNode(condition);
  }

  public provideIfStatements(document: TextDocument, range?: Range): IfStatementRefNode<NP>[] {
    const self = this;
    const program = this.parseDocument(document);
    const statements: NodePath<IfStatementKind>[] = [];

    visit(program.programNode, {
      visitIfStatement(path) {
        if ((!range || self.nodeIntersectsRange(path.node, range)) && path.name !== "alternate") statements.push(path);
        this.traverse(path);
      },
    });

    return statements.map((statement) => this.mapToSyntaxNode(statement, program) as IfStatementRefNode<NP>);
  }

  public async resolveIfStatement(statement: IfStatementRefNode<NP>): Promise<IfStatementRefNode<NP>> {
    return this.resolveSyntaxNode(statement);
  }

  public replaceCondition(
    document: TextDocument,
    edit: TextEditorEdit,
    original: RefSyntaxNode<NP>,
    replace: UpdatedSyntaxNode<NP>
  ): void {
    const code = print(this.buildNodeKind(replace)).code;
    edit.replace(original.range, code);
  }

  public replaceIfStatement(
    document: TextDocument,
    edit: TextEditorEdit,
    original: IfStatementRefNode<NP>,
    replace: IfStatementRefNode<NP>
  ): void {
    const code = print(this.buildNodeKind(replace)).code;
    edit.replace(original.range, code);
  }

  public removeCondition(
    document: TextDocument,
    edit: TextEditorEdit,
    condition: RefSyntaxNode<NP> & ExpressionContext<NP>
  ): void {
    const { range, ref, parent } = condition;

    if (TypeScriptInvertIfProvider.replaceTrueParentStatement.includes(parent.ref.node.type)) {
      // Replace empty loop conditions with true
      edit.replace(range, "true");
    } else if (parent.type == SyntaxNodeType.IfStatement) {
      // Remove empty if statements, but keep else if
      const { alternate, consequent } = parent as IfStatementRefNode<NP>;
      const indent = this.getNodeIndentation(parent.ref.node, document);
      let code = this.getBlockCode(document, consequent.ref, indent);
      if (alternate) code += `\n${this.getCode(document, alternate.ref.node, indent)}`;
      code = this.removeInitialIndent(document, parent.range, code);

      edit.replace(parent.range, code);
    } else if (ref.name == "left") {
      // Remove empty binary expressions (left)
      const { right } = parent as BinaryExpressionRefNode<NP>;
      edit.replace(range.with(range.start, right.range.start), "");
    } else if (ref.name == "right") {
      // Remove empty binary expressions (right)
      const { left } = parent as BinaryExpressionRefNode<NP>;
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
    node: UpdatedSyntaxNode<NP>,
    root: RefSyntaxNode<NP>
  ): void {
    const indent = this.getBlockIndentation(root.ref, document);
    const code = this.getCode(document, this.buildNodeKind(node), indent);
    const range = this.getBlockRange(root.ref);

    edit.insert(range.start, `${this.removeInitialIndent(document, range, code)}\n\n${indent}`);
  }

  public appendSyntaxNode(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NP>,
    root: RefSyntaxNode<NP>
  ): void {
    const indent = this.getBlockIndentation(root.ref, document);
    const code = this.getCode(document, this.buildNodeKind(node), indent);
    const range = this.getBlockRange(root.ref);

    edit.insert(range.end, `\n\n${code}`);
  }

  public insertSyntaxNodeBefore(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NP>,
    before: RefSyntaxNode<NP>
  ): void {
    const indent = this.getNodeIndentation(before.ref.node, document);
    const code = this.getCode(document, this.buildNodeKind(node), indent);
    edit.insert(before.range.start, `${this.removeInitialIndent(document, before.range, code)}\n\n${indent}`);
  }

  public insertSyntaxNodeAfter(
    document: TextDocument,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<NP>,
    after: RefSyntaxNode<NP>
  ): void {
    const indent = this.getNodeIndentation(after.ref.node, document);
    const code = this.getCode(document, this.buildNodeKind(node), indent);
    edit.insert(after.range.end, `\n\n${code}`);
  }

  private getNodeRange(node: NodeKind | CommentKind): Range {
    if (!node.loc) return new Range(0, 0, 0, 0);

    const { start, end } = node.loc;
    const base = new Range(start.line - 1, start.column, end.line - 1, end.column);

    if ("comments" in node) {
      const commentRang = node.comments?.reduce((range, comment) => range.union(this.getNodeRange(comment)), base);
      return commentRang ?? base;
    }

    return base;
  }

  private getBlockIndentation(node: NodePath, document: TextDocument): string {
    const body = this.getBody(node);
    const firstStatement = body?.node.body[0];

    return firstStatement ? this.getNodeIndentation(firstStatement, document) : "";
  }

  private getNodeIndentation(node: NodeKind, document: TextDocument): string {
    const range = this.getNodeRange(node);
    const line = document.getText(new Range(range.start.line, 0, range.start.line, Infinity));

    return /^\s*/.exec(line)?.[0] ?? "";
  }

  private removeInitialIndent(document: TextDocument, range: Range, code: string): string {
    const initialIndent =
      document.getText(new Range(range.start.line, 0, range.start.line, range.start.character)).match(/^\s*/)?.[0] ??
      "";

    if (initialIndent) return code.replace(new RegExp(`^${initialIndent}`), "");
    else return code;
  }

  private getFirstParent<N extends NodeKind, P extends NodeKind>(
    path: NodePath<N>,
    type: P["type"][]
  ): NodePath<P> | null {
    let parent: NodePath<P> | undefined = path.parent;
    while (parent && !(type as string[]).includes(parent.node.type)) parent = parent.parent;

    return parent || null;
  }

  private getBody<S extends NodeKind>(path: NodePath<S>): NodePath<BlockStatementKind> | null {
    let body = path.get("body");
    while (body?.value && "body" in body.value) body = body.get("body");

    return body;
  }

  private selectionIsForNode(selection: Range, node: NodeKind): boolean {
    if (selection.isEmpty) return this.nodeIntersectsRange(node, selection);
    else return this.nodeContainsRange(node, selection);
  }

  private nodeIntersectsRange(node: NodeKind, range: Range): boolean {
    return !!node.loc && !!range.intersection(this.getNodeRange(node));
  }

  private nodeContainsRange(node: NodeKind, range: Range): boolean {
    return !!node.loc && this.getNodeRange(node).contains(range);
  }

  private getBlockRange(node: NodePath): Range {
    const body = this.getBody(node);
    const start = body?.node.body[0]?.loc?.start ?? body?.node.loc?.start;
    const end = body?.node.body[body.node.body.length - 1]?.loc?.end ?? body?.node.loc?.end;

    if (!start || !end) return new Range(0, 0, 0, 0);

    return new Range(start.line - 1, start.column, end.line - 1, end.column);
  }

  private parseDocument(document: TextDocument): ProgramEntry {
    const { uri, version, languageId, getText } = document;
    const program: Partial<ProgramEntry> = this.programs.get(uri) || {};

    if (program?.version !== version) {
      program.version = version;
      program.programNode = this.parseText(getText(), languageId);
    }

    if (!program.root) {
      visit(program.programNode!, {
        visitProgram(path) {
          program.root = path;
          return false;
        },
      });
    }

    this.programs.set(uri, program as ProgramEntry);

    return program as ProgramEntry;
  }

  private parseText(code: string, language: string): FileKind {
    let parser = this.parsers.get(language);
    if (!parser) {
      switch (language) {
        case "typescript":
        case "ts":
          parser = require("recast/parsers/typescript");
          break;
        case "flow":
          parser = require("recast/parsers/flow");
          break;
        case "babylon":
          parser = require("recast/parsers/babylon");
          break;
        case "javascript":
        case "js":
        default:
          parser = require("recast/parsers/esprima");
          break;
      }
    }
    return parse(code, { parser });
  }

  private getBlockCode(document: TextDocument, path: NodePath, indent?: string): string {
    if (indent === undefined) indent = this.getNodeIndentation(path.node, document);
    const body = this.getBody(path)?.node.body;

    return body?.map((node) => this.getCode(document, node, indent)).join("\n") ?? "";
  }

  private getCode(document: TextDocument, node: NodeKind, indent?: string): string {
    let code = print(node).code;
    if (indent === undefined) indent = this.getNodeIndentation(node, document);

    return code.replace(/^/gm, `${indent}`); // Try to keep original indentation
  }

  private resolveSyntaxNode<N extends RefSyntaxNode<NP>>(node: N): N {
    if (!isRefNode(node)) return node;

    if (isBinaryExpressionNode(node) || isLogicalExpressionNode(node)) {
      const { left, right } = node as BinaryExpressionRefNode<NP> | LogicalExpressionRefNode<NP>;
      return {
        ...node,
        name: print(node.ref.node).code,
        description: prettyPrint(node.ref.node).code,
        left: this.resolveSyntaxNode(left),
        right: this.resolveSyntaxNode(right),
      };
    } else if (isUnaryExpressionNode(node)) {
      const { argument } = node as unknown as UnaryExpressionRefNode<NP>;
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
        test: this.resolveSyntaxNode(node.test as RefSyntaxNode<NP>),
      };
    } else if (isLoopNode(node)) {
      return {
        ...node,
        name: print(node.ref.node).code,
        description: prettyPrint(node.ref.node).code,
        test: this.resolveSyntaxNode((node as LoopRefNode<NP>).test),
      };
    } else if (isIfStatementNode(node)) {
      return {
        ...node,
        name: `if (${this.resolveSyntaxNode(node.test as RefSyntaxNode<NP>)}) { ... }`,
        description: prettyPrint(node.ref.node).code,
        test: this.resolveSyntaxNode(node.test as RefSyntaxNode<NP>),
        alternate: this.resolveSyntaxNode(node.alternate as RefSyntaxNode<NP>),
        consequent: this.resolveSyntaxNode(node.consequent as RefSyntaxNode<NP>),
      };
    } else {
      return {
        ...node,
        name: print(node.ref.node).code,
        description: prettyPrint(node.ref.node).code,
      };
    }
  }

  private mapToSyntaxNode(
    path: NP,
    program: ProgramEntry,
    includeContext: true
  ): RefSyntaxNode<NP> & ExpressionContext<NP>;
  private mapToSyntaxNode(path: NP, program: ProgramEntry, includeContext?: false): RefSyntaxNode<NP>;
  private mapToSyntaxNode(path: NP, program: ProgramEntry, includeContext = false): RefSyntaxNode<NP> {
    const { node, parent } = path;
    const base = { ref: path, range: this.getNodeRange(node) };
    const context = includeContext
      ? {
          parent: this.mapToSyntaxNode(parent, program),
          root: this.mapToSyntaxNode(
            this.getFirstParent(path, TypeScriptInvertIfProvider.guardClauseParentTypes) ?? program.root,
            program
          ),
        }
      : {};
    let operator;

    switch (node.type) {
      case "IfStatement":
        const ifNode: IfStatementRefNode<NP> = {
          ...base,
          ...context,
          type: SyntaxNodeType.IfStatement,
          test: this.mapToSyntaxNode(new NodePathInstance(node.test, path), program),
          consequent: this.mapToSyntaxNode(new NodePathInstance(node.consequent, path), program),
          alternate: node.alternate
            ? this.mapToSyntaxNode(new NodePathInstance(node.alternate, path), program)
            : undefined,
        };
        return ifNode;
      case "BinaryExpression":
        operator = TypeScriptInvertIfProvider.binaryExpressionOperators[node.operator];
        if (!operator) return { type: SyntaxNodeType.Generic, ...base };
        const binaryNode: BinaryExpressionRefNode<NP> = {
          ...base,
          ...context,
          type: SyntaxNodeType.BinaryExpression,
          left: this.mapToSyntaxNode(path.get("left"), program),
          right: this.mapToSyntaxNode(path.get("right"), program),
          operator,
        };
        return binaryNode;
      case "LogicalExpression":
        operator = TypeScriptInvertIfProvider.logicalExpressionOperators[node.operator];
        if (!operator) return { type: SyntaxNodeType.Generic, ...base };
        const logicalNode: LogicalExpressionRefNode<NP> = {
          ...base,
          ...context,
          type: SyntaxNodeType.LogicalExpression,
          left: this.mapToSyntaxNode(path.get("left"), program),
          right: this.mapToSyntaxNode(path.get("right"), program),
          operator,
        };
        return logicalNode;
      case "UnaryExpression":
        operator = TypeScriptInvertIfProvider.unaryExpressionOperators[node.operator];
        if (!operator) return { type: SyntaxNodeType.Generic, ...base };
        const unaryNode: UnaryExpressionRefNode<NP> = {
          ...base,
          ...context,
          type: SyntaxNodeType.UnaryExpression,
          argument: this.mapToSyntaxNode(path.get("argument"), program),
          operator,
        };
        return unaryNode;
      case "FunctionDeclaration":
      case "FunctionExpression":
      case "ArrowFunctionExpression":
        const functionNode: FunctionDeclarationRefNode<NP> = {
          ...base,
          ...context,
          type: SyntaxNodeType.FunctionDeclaration,
          ref: path,
        };
        return functionNode;
      case "DoWhileStatement":
        const doWhileNode: DoWhileStatementRefNode<NP> = {
          ...base,
          ...context,
          type: SyntaxNodeType.DoWhileStatement,
          test: this.mapToSyntaxNode(path.get("test"), program),
        };
        return doWhileNode;
      case "WhileStatement":
        const whileNode: WhileStatementRefNode<NP> = {
          ...base,
          ...context,
          type: SyntaxNodeType.WhileStatement,
          test: this.mapToSyntaxNode(path.get("test"), program),
        };
        return whileNode;
      case "ForStatement":
        const forNode: ForStatementRefNode<NP> = {
          ...base,
          ...context,
          type: SyntaxNodeType.ForStatement,
          test: path.get("test")
            ? this.mapToSyntaxNode(path.get("test"), program)
            : { type: SyntaxNodeType.Empty, ...base },
        };
        return forNode;
      case "ReturnStatement":
        const returnNode: GeneralStatementRefNode<NP> = {
          ...base,
          ...context,
          type: SyntaxNodeType.ReturnStatement,
          argument: path.get("argument") ? this.mapToSyntaxNode(path.get("argument"), program) : undefined,
        };
        return returnNode;
      case "BreakStatement":
        const breakNode: GeneralStatementRefNode<NP> = {
          type: SyntaxNodeType.BreakStatement,
          ...base,
          ...context,
        };
        return breakNode;
      case "ContinueStatement":
        const continueNode: GeneralStatementRefNode<NP> = {
          ...base,
          ...context,
          type: SyntaxNodeType.ContinueStatement,
        };
        return continueNode;
      default:
        const generic: GenericRefNode<NP> = {
          ...base,
          ...context,
          type: SyntaxNodeType.Generic,
        };
        return generic;
    }
  }

  private buildNodeKind(node: UpdatedSyntaxNode<NP>, locSource?: RefSyntaxNode<NP>): NodeKind {
    if (node.removed) return types.builders.noop();

    const { ref, changed, created } = node;
    if (ref && !(changed || created)) return ref.node;

    if (node.type == SyntaxNodeType.IfStatement) {
      const { test, consequent, alternate } = node as IfStatementUpdatedNode<NP>;
      if (ref) {
        if (test?.removed) ref.get("test").prune();
        else if (test.changed || test.created) ref.get("test").replace(this.buildNodeKind(test));

        const consequentNode = this.buildNodeKind(consequent);
        const alternateNode = alternate && this.buildNodeKind(alternate);

        if (consequent?.removed) ref.get("consequent").prune();
        else ref.get("consequent").replace(consequentNode);

        if (alternate?.removed) ref.get("alternate").prune();
        else if (alternateNode) ref.get("alternate").replace(alternateNode);
      }

      return (
        ref?.node ??
        types.builders.ifStatement.from({
          test: this.buildNodeKind(test) as ExpressionKind,
          consequent: consequent ? (this.buildNodeKind(consequent) as StatementKind) : types.builders.noop(),
          alternate: alternate ? (this.buildNodeKind(alternate) as StatementKind) : null,
          loc: locSource ? this.rangeToLoc(locSource.range) : node.range ? this.rangeToLoc(node.range) : null,
        })
      );
    } else if (node.type == SyntaxNodeType.BinaryExpression) {
      const { left, right, operator } = node as BinaryExpressionUpdatedNode<NP>;

      const newExpression: BinaryExpressionKind = types.builders.binaryExpression.from({
        operator: TypeScriptInvertIfProvider.reverseBinaryExpressionOperator(operator),
        left: this.buildNodeKind(left) as ExpressionKind,
        right: this.buildNodeKind(right) as ExpressionKind,
        loc: locSource ? this.rangeToLoc(locSource.range) : node.range ? this.rangeToLoc(node.range) : null,
      });

      if (ref) ref.replace(newExpression);

      return ref?.node ?? newExpression;
    } else if (node.type == SyntaxNodeType.LogicalExpression) {
      const { left, right, operator } = node as LogicalExpressionUpdatedNode<NP>;

      const newExpression: LogicalExpressionKind = types.builders.logicalExpression.from({
        operator: TypeScriptInvertIfProvider.reverseLogicalExpressionOperator(operator),
        left: this.buildNodeKind(left) as ExpressionKind,
        right: this.buildNodeKind(right) as ExpressionKind,
        loc: locSource ? this.rangeToLoc(locSource.range) : node.range ? this.rangeToLoc(node.range) : null,
      });

      if (ref) ref.replace(newExpression);

      return ref?.node ?? newExpression;
    } else if (node.type == SyntaxNodeType.UnaryExpression) {
      const { argument, operator } = node as UnaryExpressionUpdatedNode<NP>;

      const newExpression: UnaryExpressionKind = types.builders.unaryExpression.from({
        operator: TypeScriptInvertIfProvider.reverseUnaryExpressionOperator(operator),
        argument: this.buildNodeKind(argument) as ExpressionKind,
        loc: locSource ? this.rangeToLoc(locSource.range) : node.range ? this.rangeToLoc(node.range) : null,
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

  private rangeToLoc(range: Range): SourceLocationKind {
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
}
