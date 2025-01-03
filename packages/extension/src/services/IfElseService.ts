import { Range, TextEditorEdit, window } from "vscode";
import {
  ConditionRefNode,
  DocumentContext,
  IfStatementRefNode,
  IfStatementUpdatedNode,
  InvertIfElseProvider,
  isConditionNode,
  isIfStatementNode,
  LogicalOperator,
  RefSyntaxNode,
  SyntaxNodeType,
  UpdatedSyntaxNode,
} from "vscode-invert-if";
import ConditionService from "./ConditionService";
import ConfigurationService from "./ConfigurationService";

export default class IfElseService {
  public constructor(
    protected configurationService: ConfigurationService,
    protected conditionService: ConditionService
  ) {}

  public inverseIfElse<T>(
    context: DocumentContext,
    edit: TextEditorEdit,
    provider: InvertIfElseProvider<T>,
    ifElse: IfStatementRefNode<T>
  ) {
    try {
      const inverse = this.getInverseIfElse(ifElse);
      provider.replaceIfStatement(context, edit, ifElse, inverse);
    } catch (e) {
      window.showErrorMessage((e as Error).message ?? "unknown error inverting if statement");
      return;
    }
  }

  public getInverseIfElse<T>(node: IfStatementRefNode<T>): IfStatementUpdatedNode<T> {
    const { consequent, alternate, test } = node;

    if (alternate && alternate.type == SyntaxNodeType.IfStatement) {
      throw new Error("cannot invert if block with else-if statement");
    }

    const inverseCondition = isConditionNode(test)
      ? this.conditionService.getInverseCondition(test as ConditionRefNode<T>)
      : this.conditionService.getInverseGroup(test as RefSyntaxNode<T>);
    return {
      ...node,
      test: inverseCondition,
      alternate: consequent,
      consequent: alternate ?? { type: SyntaxNodeType.Empty, created: true },
      changed: true,
    };
  }

  public mergeNestedIfs<T>(
    context: DocumentContext,
    edit: TextEditorEdit,
    provider: InvertIfElseProvider<T>,
    parent: IfStatementRefNode<T>,
    ...statements: IfStatementRefNode<T>[]
  ) {
    const combined = this.getCombinedIfElse(parent, ...statements);
    provider.replaceIfStatement(context, edit, parent, combined);
  }

  public getCombinedIfElse<T>(
    parent: IfStatementRefNode<T>,
    ...statements: IfStatementRefNode<T>[]
  ): IfStatementUpdatedNode<T>;
  public getCombinedIfElse<T>(...statements: IfStatementRefNode<T>[]): IfStatementUpdatedNode<T> {
    let consequent: UpdatedSyntaxNode<T> | null = null;
    const conditions: UpdatedSyntaxNode<T>[] = [];
    let alternate: UpdatedSyntaxNode<T> | null = null;

    for (const statement of statements) {
      let alternateBlock: UpdatedSyntaxNode<T> | null = this.extendAlternates(statement, conditions);

      consequent = statement.consequent;
      conditions.push(statement.test);
      if (alternate && alternateBlock && isIfStatementNode(alternateBlock)) alternateBlock.alternate = alternate;
      if (alternateBlock) alternate = alternateBlock;
    }

    return consequent
      ? {
          type: SyntaxNodeType.IfStatement,
          test: this.conditionService.chainConditions(LogicalOperator.And, ...conditions),
          consequent,
          alternate: alternate ?? undefined,
          created: true,
          changed: true,
        }
      : statements[0];
  }

  public sortIfStatementsByRangeMatch<T, N extends IfStatementRefNode<T>>(conditions: N[], range: Range): N[] {
    return conditions.sort((a, b) => {
      const aRange = a.range;
      const bRange = b.range;
      const aIntersect = aRange.intersection(range);
      const bIntersect = bRange.intersection(range);

      if (aIntersect ? !bIntersect : bIntersect) return aIntersect ? 1 : -1;

      const diff =
        aIntersect && bIntersect
          ? aIntersect.end.compareTo(bIntersect.end) - aIntersect.start.compareTo(bIntersect.start)
          : 0;
      return diff == 0 ? aRange.start.compareTo(bRange.start) - aRange.end.compareTo(bRange.end) : diff;
    });
  }

  public groupIfStatementsByParent<T>(statements: IfStatementRefNode<T>[]): IfStatementRefNode<T>[][] {
    const groups: IfStatementRefNode<T>[][] = [];
    let currentGroup: IfStatementRefNode<T>[] = [];

    const sorted = [...statements].sort((a, b) => a.range.start.compareTo(b.range.start));

    for (const statement of sorted) {
      if (currentGroup.length == 0) {
        currentGroup.push(statement);
        continue;
      }

      const last = currentGroup[currentGroup.length - 1];
      if (last.range.contains(statement.range)) {
        currentGroup.push(statement);
        continue;
      }

      groups.push(currentGroup);
      currentGroup = [statement];
    }

    if (currentGroup.length > 0) groups.push(currentGroup);

    return groups;
  }

  private extendAlternates<T>(
    node: IfStatementUpdatedNode<T>,
    conditions: UpdatedSyntaxNode<T>[]
  ): UpdatedSyntaxNode<T> | null {
    let result: UpdatedSyntaxNode<T> | null = null;

    let current: UpdatedSyntaxNode<T> | null | undefined = node.alternate;
    while (current) {
      const alternateCondition = isIfStatementNode(current) ? [current.test] : [];
      const alternateBody = isIfStatementNode(current) ? current.consequent : current;
      const alternate: IfStatementUpdatedNode<T> | UpdatedSyntaxNode<T> =
        conditions.length || alternateCondition.length
          ? {
              type: SyntaxNodeType.IfStatement,
              test: this.conditionService.chainConditions(LogicalOperator.And, ...conditions, ...alternateCondition),
              consequent: alternateBody,
            }
          : alternateBody;

      if (!result) result = alternate;
      else if (isIfStatementNode(result)) result.alternate = alternate;
      else throw new Error(`unexpected statement type: ${result.type}`);

      current = isIfStatementNode(current) ? current.alternate : null;
    }

    return result;
  }
}
