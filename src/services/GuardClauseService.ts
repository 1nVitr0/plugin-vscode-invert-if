import { astNodesAreEquivalent, NodePath, visit } from 'ast-types';
import { NodePath as NodePathType } from 'ast-types/lib/node-path';
import {
  BreakStatementKind,
  ContinueStatementKind,
  ExpressionKind,
  IfStatementKind,
  ReturnStatementKind,
  StatementKind,
} from 'ast-types/gen/kinds';
import { types } from 'recast';
import ConditionInversionService from './ConditionInversionService';
import ConfigurationService from './ConfigurationService';
import { BinaryExpressionKind, LogicalExpressionKind } from 'ast-types/gen/kinds';

export enum GuardClauseType {
  break,
  continue,
  return,
  auto,
}

export enum GuardClausePosition {
  prepend,
  append,
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
    protected conditionInversionService: ConditionInversionService
  ) {}

  public moveToGuardClause<S extends StatementKind>(
    block: S,
    condition: ExpressionKind,
    position: GuardClausePosition = GuardClausePosition.auto,
    type: GuardClauseType = GuardClauseType.auto
  ): S {
    const detectedGuardType: Exclude<GuardClauseType, GuardClauseType.auto> =
      type == GuardClauseType.auto ? this.detectGuardClauseType(block) : type;
    const detectedPosition: Exclude<GuardClausePosition, GuardClausePosition.auto> =
      position == GuardClausePosition.auto ? this.detectGuardClausePosition(block) : position;

    block = this.removeExpression(block, condition);

    const body = this.getBody(block);
    const guardClause = this.toGuardClause(condition, detectedGuardType);

    if (detectedPosition == GuardClausePosition.append) body.push(guardClause);
    else body.unshift(guardClause);

    return block;
  }

  public removeExpression<S extends StatementKind>(block: S, condition: ExpressionKind): S {
    return visit(block, {
      visitExpression(path) {
        if (!astNodesAreEquivalent(path.node, condition)) return this.traverse(path);

        if (GuardClauseService.replaceTrueParentStatement.includes(path.parent?.node?.type)) {
          // Replace empty loop conditions with true
          path.replace(types.builders.literal(true));
        } else if (path.parent?.node?.type == 'IfStatement') {
          // Remove empty if statements, but keep else if
          const parent: NodePathType<IfStatementKind> = path.parent;
          if (parent.node.alternate) parent.insertAfter(parent.node.alternate);
          parent.insertAfter(parent.node.consequent);
          parent.prune();
        } else if (path.name == 'left') {
          // Replace empty binary expressions (left)
          path.parent.replace(path.parent.node.right);
        } else if (path.name == 'right') {
          // Replace empty binary expressions (right)
          path.parent.replace(path.parent.node.left);
        } else if (path.name == 'argument') {
          // Remove empty unary expressions
          path.parent.prune();
        } else {
          // Delete condition used as guard clause
          path.prune();
        }

        return false; // Stop traversing
      },
    });
  }

  public toGuardClause(
    condition: ExpressionKind,
    type: Exclude<GuardClauseType, GuardClauseType.auto>
  ): IfStatementKind {
    const statement = this.getGuardStatement(type);
    return types.builders.ifStatement(condition, statement);
  }

  public detectGuardClauseType(block: StatementKind): Exclude<GuardClauseType, GuardClauseType.auto> {
    switch (block.type) {
      case 'WhileStatement':
      case 'DoWhileStatement':
      case 'ForStatement':
        return GuardClauseType.break;
      case 'FunctionDeclaration':
      default:
        return GuardClauseType.return;
    }
  }

  public detectGuardClausePosition(block: StatementKind): Exclude<GuardClausePosition, GuardClausePosition.auto> {
    switch (block.type) {
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

  private getBody<S extends StatementKind>(node: S): NodePathType<S> {
    const path = new NodePath(node);
    let body = path.get('body');
    while ('body' in body.value) body = body.get('body');

    return body;
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
