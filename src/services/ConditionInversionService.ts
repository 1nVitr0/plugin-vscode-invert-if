import {
  ExpressionKind,
  UnaryExpressionKind,
  BinaryExpressionKind,
  LogicalExpressionKind,
  StatementKind,
} from 'ast-types/gen/kinds';
import { visit } from 'ast-types';
import { types } from 'recast';
import ConfigurationService from './ConfigurationService';

export type ConditionalExpression = BinaryExpressionKind | UnaryExpressionKind | LogicalExpressionKind;

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

  public extractConditions(node: types.ASTNode, depth = 1): ExpressionKind[] {
    const conditions: ExpressionKind[] = [];

    visit(node, {
      visitIfStatement: ({ node }) => conditions.push(...this.extractConditionsDeep(node, depth)),
      visitForStatement: ({ node }) => conditions.push(...this.extractConditionsDeep(node, depth)),
      visitWhileStatement: ({ node }) => conditions.push(...this.extractConditionsDeep(node, depth)),
      visitDoWhileStatement: ({ node }) => conditions.push(...this.extractConditionsDeep(node, depth)),
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

  private extractConditionsDeep(statement: StatementKind, depth: number): ExpressionKind[] {
    const conditions: ExpressionKind[] = [];
    switch (statement.type) {
      case 'IfStatement':
        conditions.push(statement.test);
        if (statement.alternate) conditions.push(...this.extractConditions(statement.alternate, depth));
        if (depth > 0) conditions.push(...this.extractConditions(statement.consequent, depth - 1));
        break;
      case 'ForStatement':
      case 'WhileStatement':
      case 'DoWhileStatement':
        if (statement.test) conditions.push(statement.test);
        if (depth > 0) conditions.push(...this.extractConditions(statement.body, depth - 1));
        break;
      default:
        if ('body' in statement && statement.body && depth > 0) {
          if (statement.body instanceof Array)
            for (const item of statement.body) conditions.push(...this.extractConditions(item, depth - 1));
          else conditions.push(...this.extractConditions(statement.body, depth - 1));
        }
    }

    return conditions;
  }
}
