import { BinaryExpressionKind, ExpressionKind, LogicalExpressionKind, UnaryExpressionKind } from 'ast-types/gen/kinds';
import { types } from 'recast';
import ConfigurationService from './ConfigurationService';

type OperatorMap<
  K extends ExpressionKind & { operator: string },
  V extends ExpressionKind & { operator: string } = K,
  A = never
> = Record<K['operator'], V['operator'] | A>;

export default class ConditionService {
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

  public inverse(condition: ExpressionKind, depth = this.configurationService.inversionDepth): ExpressionKind {
    if (depth == 0) return this.inverseGroup(condition);

    switch (condition.type) {
      case 'UnaryExpression':
        return this.inverseGroup(condition as types.namedTypes.UnaryExpression);
      case 'LogicalExpression':
        const inverseLogical = ConditionService.inverseOperator[(condition as LogicalExpressionKind).operator];
        return types.builders.logicalExpression(
          inverseLogical,
          this.inverse(condition.left, depth - 1),
          this.inverse(condition.right, depth - 1)
        );
      case 'BinaryExpression':
        const inverseBinary = ConditionService.inverseOperator[(condition as BinaryExpressionKind).operator];
        if (!inverseBinary) return this.inverseGroup(condition);
        return types.builders.binaryExpression(inverseBinary, condition.left, condition.right);
      default:
        return this.inverseGroup(condition);
    }
  }

  public inverseGroup(condition: ExpressionKind): ExpressionKind {
    if (condition.type !== 'UnaryExpression') return types.builders.unaryExpression('!', condition, true);

    const inverse = ConditionService.inverseUnaryOperator[condition.operator];
    if (inverse) return types.builders.unaryExpression(inverse, condition.argument, condition.prefix);
    else if (inverse == null) return condition.argument;
    else return types.builders.unaryExpression('!', condition, true);
  }
}
