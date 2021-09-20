import { ExpressionKind, UnaryExpressionKind, BinaryExpressionKind, LogicalExpressionKind } from 'ast-types/gen/kinds';
import { visit } from 'ast-types';
import { types } from 'recast';
import ConfigurationService from './ConfigurationService';

type ConditionalExpression = BinaryExpressionKind | UnaryExpressionKind | LogicalExpressionKind;

type OperatorMap<
  K extends ExpressionKind & { operator: string },
  V extends ExpressionKind & { operator: string } = K,
  A = never
> = Record<K['operator'], V['operator'] | A>;

export function isConditionalExpression(node: ExpressionKind): node is ConditionalExpression {
  return ['BinaryExpression', 'LogicalExpression', 'UnaryExpression'].includes(node.type);
}

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

  public extractConditions(node: types.ASTNode): ExpressionKind[] {
    const conditions: ExpressionKind[] = [];

    visit(node, {
      visitIfStatement: (statement) => conditions.push(statement.node.test),
      visitForStatement: (statement) => statement.node.test && conditions.push(statement.node.test),
      visitWhileStatement: (statement) => conditions.push(statement.node.test),
      visitDoWhileStatement: (statement) => conditions.push(statement.node.test),
    });

    return conditions;
  }

  public inverse(condition: ExpressionKind, depth = this.configurationService.inversionDepth): ExpressionKind {
    if (!isConditionalExpression(condition) || depth == 0) return this.inverseGroup(condition);

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
