import ConfigurationService from './ConfigurationService';
import { ConditionalExpression } from './ConditionInversionService';
import { ExpressionKind } from 'ast-types/gen/kinds';
import { print, types } from 'recast';
import ConditionInversionService from './ConditionInversionService';
import deepEqual = require('deep-equal');

export type TruthTable<V extends string> = { [key in V | 'result']: boolean }[];
export default class ConditionValidationService {
  public constructor(private configurationService: ConfigurationService) {}

  public verifyEqual(condition: ConditionalExpression, compare: ConditionalExpression): boolean {
    throw new Error('not implemented');
  }

  public verifyInverse(condition: ConditionalExpression, inverse: ConditionalExpression): boolean {
    throw new Error('not implemented');
  }

  public generateTruthTable(condition: ConditionalExpression): TruthTable<string> {
    const evaluation = this.buildConditionEvaluation(condition);
    const parameters = [...new Set(evaluation.conditions)].sort();

    return this.truthPermutations(parameters.length).map((permutation) => {
      const parameterValues = evaluation.conditions.map((parameter) => permutation[parameter.indexOf(parameter)]);
      return {
        ...parameters.reduce((o, k, i) => ({ ...o, [k]: permutation[i] }), {}),
        result: evaluation.evaluate(...parameterValues),
      };
    });
  }

  public compareTruthTables<V extends string>(table: TruthTable<V>, compare: TruthTable<V>): boolean {
    return deepEqual(table, compare);
  }

  private buildConditionEvaluation(condition: ExpressionKind): {
    evaluate: (...args: boolean[]) => boolean;
    conditions: string[];
  } {
    switch (condition.type) {
      case 'BinaryExpression':
      case 'LogicalExpression':
        const inverse = ConditionInversionService.inverseOperator[condition.operator];
        if (condition.operator == '&&' || condition.operator == '||') {
          const left = this.buildConditionEvaluation(condition.left);
          const right = this.buildConditionEvaluation(condition.right);
          return {
            evaluate:
              condition.operator == '&&'
                ? (...args) =>
                    left.evaluate(...args.slice(0, left.conditions.length)) &&
                    right.evaluate(...args.slice(right.conditions.length))
                : (...args) =>
                    left.evaluate(...args.slice(0, left.conditions.length)) ||
                    right.evaluate(...args.slice(right.conditions.length)),
            conditions: [...left.conditions, ...right.conditions],
          };
        } else if (inverse) {
          condition.operator = inverse;
          condition = types.builders.unaryExpression('!', condition);
        }
      case 'UnaryExpression':
        if (condition.operator === '!') {
          const argument = this.buildConditionEvaluation(condition.argument);
          return {
            evaluate: (...args) => !argument.evaluate(...args),
            conditions: argument.conditions,
          };
        }
      default:
        return {
          evaluate: (arg) => arg,
          conditions: [print(condition).code],
        };
    }
  }

  private truthPermutations<N extends number>(variables: N): (boolean[] & { length: N })[] & { length: N } {
    const result: boolean[][] = [];
    for (let binaryRow = 0; binaryRow < Math.pow(variables, 2); binaryRow++)
      result.push(Array(variables).map((_, i) => !!(binaryRow & (0b1 << i))));

    return result as (boolean[] & { length: N })[] & { length: N };
  }
}
