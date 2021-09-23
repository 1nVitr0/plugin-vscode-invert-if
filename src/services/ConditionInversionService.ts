import {
  ExpressionKind,
  UnaryExpressionKind,
  BinaryExpressionKind,
  LogicalExpressionKind,
  StatementKind,
  ForStatementKind,
  DoWhileStatementKind,
} from 'ast-types/gen/kinds';
import { visit, Visitor } from 'ast-types';
import { types } from 'recast';
import ConfigurationService from './ConfigurationService';
import { IfStatementKind, WhileStatementKind } from 'ast-types/gen/kinds';
import { NodePath } from 'ast-types/lib/node-path';
import { SharedContextMethods } from 'ast-types/lib/path-visitor';

type OperatorMap<
  K extends ExpressionKind & { operator: string },
  V extends ExpressionKind & { operator: string } = K,
  A = never
> = Record<K['operator'], V['operator'] | A>;

export default class ConditionInversionService {
  public static inverseOperator: Partial<OperatorMap<BinaryExpressionKind>> & OperatorMap<LogicalExpressionKind> = {
    '==': '!=',
    '===': '!==',
    '!=': '==',
    '!==': '===',
    '&&': '||',
    '||': '&&',
    '??': '&&',
    '<': '>=',
    '<=': '>',
    '>': '<=',
    '>=': '<',
  };
  public static inverseUnaryOperator: Partial<OperatorMap<UnaryExpressionKind, UnaryExpressionKind, null>> = {
    '!': null,
  };

  public constructor(private configurationService: ConfigurationService) {}

  public extractConditions(node: types.ASTNode, max = Infinity): ExpressionKind[] {
    const conditions: ExpressionKind[] = [];

    function addCondition(this: SharedContextMethods, path: NodePath<StatementKind & { test: any }>) {
      if (path.node.test) conditions.push(path.node.test);
      if (conditions.length < max) this.traverse(path);
      else return false;
    }

    visit(node, {
      visitIfStatement: addCondition,
      visitForStatement: addCondition,
      visitWhileStatement: addCondition,
      visitDoWhileStatement: addCondition,
    });

    return conditions;
  }

  public inverse(condition: ExpressionKind, depth = this.configurationService.inversionDepth): ExpressionKind {
    if (depth == 0) return this.inverseGroup(condition);

    switch (condition.type) {
      case 'UnaryExpression':
        return this.inverseGroup(condition as types.namedTypes.UnaryExpression);
      case 'LogicalExpression':
        const inverseLogical = ConditionInversionService.inverseOperator[(condition as LogicalExpressionKind).operator];
        return types.builders.logicalExpression(
          inverseLogical,
          this.inverse(condition.left, depth - 1),
          this.inverse(condition.right, depth - 1)
        );
      case 'BinaryExpression':
        const inverseBinary = ConditionInversionService.inverseOperator[(condition as BinaryExpressionKind).operator];
        if (!inverseBinary) return this.inverseGroup(condition);
        return types.builders.binaryExpression(inverseBinary, condition.left, condition.right);
      default:
        return this.inverseGroup(condition);
    }
  }

  public inverseGroup(condition: ExpressionKind): ExpressionKind {
    if (condition.type !== 'UnaryExpression') return types.builders.unaryExpression('!', condition, true);

    const inverse = ConditionInversionService.inverseUnaryOperator[condition.operator];
    if (inverse) return types.builders.unaryExpression(inverse, condition.argument, condition.prefix);
    else if (inverse == null) return condition.argument;
    else return types.builders.unaryExpression('!', condition, true);
  }
}
