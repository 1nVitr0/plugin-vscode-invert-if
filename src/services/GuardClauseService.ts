import { astNodesAreEquivalent } from 'ast-types';
import {
  BreakStatementKind,
  ContinueStatementKind,
  ExpressionKind,
  IfStatementKind,
  NodeKind,
  ReturnStatementKind,
  StatementKind,
} from 'ast-types/gen/kinds';
import { NodePath as NodePathType } from 'ast-types/lib/node-path';
import { types } from 'recast';
import ASTService from './ASTService';
import ConditionInversionService from './ConditionInversionService';
import ConfigurationService from './ConfigurationService';

export enum GuardClauseType {
  break,
  continue,
  return,
  auto,
}

export enum GuardClausePosition {
  prepend,
  append,
  keep,
  auto,
}

export default class GuardClauseService {
  protected static replaceTrueParentStatement: StatementKind['type'][] = [
    'WhileStatement',
    'DoWhileStatement',
    'ForStatement',
  ];

  public constructor(
    protected configurationService: ConfigurationService,
    protected astService: ASTService,
    protected conditionInversionService: ConditionInversionService
  ) {}

  public moveToGuardClause<S extends NodeKind>(
    block: NodePathType<S>,
    condition: NodePathType<ExpressionKind>,
    position: GuardClausePosition = GuardClausePosition.auto,
    type: GuardClauseType = GuardClauseType.auto
  ): NodePathType<S> {
    const detectedGuardType: Exclude<GuardClauseType, GuardClauseType.auto> =
      type == GuardClauseType.auto ? this.detectGuardClauseType(block) : type;
    const detectedPosition: Exclude<GuardClausePosition, GuardClausePosition.auto> =
      position == GuardClausePosition.auto ? this.detectGuardClausePosition(block, condition) : position;

    const body = this.getBody(block);
    const guardClause = this.toGuardClause(condition.node, detectedGuardType);

    if (detectedPosition == GuardClausePosition.append) body.push(guardClause);
    else if (detectedPosition == GuardClausePosition.keep) this.insertBeforeParent(body, condition, guardClause);
    else body.unshift(guardClause);

    block = this.removeExpression(block, condition);

    return block;
  }

  public removeExpression<S extends NodeKind>(
    block: NodePathType<S>,
    condition: NodePathType<ExpressionKind>
  ): NodePathType<S> {
    if (GuardClauseService.replaceTrueParentStatement.includes(condition.parent?.node?.type)) {
      // Replace empty loop conditions with true
      condition.replace(types.builders.literal(true));
    } else if (condition.parent?.node?.type == 'IfStatement') {
      // Remove empty if statements, but keep else if
      const parent: NodePathType<IfStatementKind> = condition.parent;
      const { alternate, consequent } = parent.node;
      if (alternate) parent.insertAfter(alternate);
      if (consequent.type == 'BlockStatement') for (const child of consequent.body) parent.insertBefore(child);
      else parent.insertAfter(consequent);
      parent.prune();
    } else if (condition.name == 'left') {
      // Replace empty binary expressions (left)
      condition.parent.replace(condition.parent.node.right);
    } else if (condition.name == 'right') {
      // Replace empty binary expressions (right)
      condition.parent.replace(condition.parent.node.left);
    } else if (condition.name == 'argument') {
      // Remove empty unary expressions
      condition.parent.prune();
    } else {
      // Delete condition used as guard clause
      condition.prune();
    }

    return block;
  }

  public toGuardClause(
    condition: ExpressionKind,
    type: Exclude<GuardClauseType, GuardClauseType.auto>,
    invert = true
  ): IfStatementKind {
    const statement = this.getGuardStatement(type);
    if (invert) condition = this.conditionInversionService.inverse(condition);
    return types.builders.ifStatement(condition, statement);
  }

  public detectGuardClauseType(block: NodePathType<NodeKind>): Exclude<GuardClauseType, GuardClauseType.auto> {
    switch (block.node.type) {
      case 'WhileStatement':
      case 'DoWhileStatement':
      case 'ForStatement':
        return GuardClauseType.break;
      case 'FunctionDeclaration':
      default:
        return GuardClauseType.return;
    }
  }

  public detectGuardClausePosition(
    block: NodePathType<NodeKind>,
    condition: NodePathType<ExpressionKind>
  ): Exclude<GuardClausePosition, GuardClausePosition.auto> {
    if (this.astService.getFirstParent(condition, ['IfStatement'])) return GuardClausePosition.keep;

    switch (block.node.type) {
      case 'WhileStatement':
      case 'ForStatement':
        return GuardClausePosition.append;
      case 'DoWhileStatement':
        return GuardClausePosition.prepend;
      case 'FunctionDeclaration':
      default:
        return GuardClausePosition.prepend;
    }
  }

  private getBody<S extends NodeKind>(path: NodePathType<S>): NodePathType<S> {
    let body = path.get('body');
    while (body.value && 'body' in body.value) body = body.get('body');

    return body;
  }

  private insertBeforeParent(
    block: NodePathType<NodeKind>,
    before: NodePathType<NodeKind>,
    node: NodeKind
  ): NodePathType<NodeKind> {
    while (!astNodesAreEquivalent(before.parent.node, block.node)) before = before.parent;
    before.insertBefore(node);

    return block;
  }

  private getGuardStatement(
    type: Exclude<GuardClauseType, GuardClauseType.auto>
  ): BreakStatementKind | ReturnStatementKind | ContinueStatementKind {
    switch (type) {
      case GuardClauseType.break:
        return types.builders.breakStatement();
      case GuardClauseType.continue:
        return types.builders.continueStatement();
      case GuardClauseType.return:
        return types.builders.returnStatement(null);
    }
  }
}
