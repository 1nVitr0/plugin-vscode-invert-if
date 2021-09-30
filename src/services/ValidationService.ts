import { BinaryExpressionKind, ExpressionKind, LogicalExpressionKind } from 'ast-types/gen/kinds';
import { print, types } from 'recast';
import ConfigurationService from './ConfigurationService';
import ConditionService from './ConditionService';

export type TruthTable<V extends string> = { [key in V | 'result']: boolean }[];
export type CompareTruthTable<V extends string> = ({ [key in V | 'result']: boolean | boolean[] } & {
  [key in V]: boolean;
} & { result: boolean[] })[];
export default class ValidationService {
  protected static inverseOperatorSelection: (BinaryExpressionKind | LogicalExpressionKind)['operator'][] = [
    '!=',
    '!==',
    '<=',
    '>=',
  ];

  public constructor(private configurationService: ConfigurationService) {}

  public validateEqual(condition: ExpressionKind, compare: ExpressionKind): boolean {
    const table = this.generateTruthTable(condition);
    const compareTable = this.generateTruthTable(compare);
    return this.compareTruthTables(table, compareTable);
  }

  public validateInverse(condition: ExpressionKind, inverse: ExpressionKind): boolean {
    const table = this.generateTruthTable(condition);
    const compareTable = this.generateTruthTable(inverse).map((row) => ({ ...row, result: !row.result }));
    return this.compareTruthTables(table, compareTable);
  }

  public groupConditions(conditions: ExpressionKind[]): ExpressionKind[][] {
    const map: Record<string, ExpressionKind[]> = {};
    for (const condition of conditions) {
      const key = this.parameters(condition).join('');
      if (map[key]) map[key].push(condition);
      else map[key] = [condition];
    }

    return Object.values(map);
  }

  public parameters(condition: ExpressionKind): string[] {
    const evaluation = this.buildConditionEvaluation(condition);
    return [...new Set(evaluation.conditions)].sort();
  }

  public generateTruthTable(condition: ExpressionKind): TruthTable<string> {
    const evaluation = this.buildConditionEvaluation(condition);
    const parameters = [...new Set(evaluation.conditions)].sort();
    const permutations = this.truthPermutations(parameters.length);

    return permutations.map((permutation) => {
      const parameterValues = evaluation.conditions.map((parameter) => permutation[parameters.indexOf(parameter)]);
      return {
        ...parameters.reduce((o, k, i) => ({ ...o, [k]: permutation[i] }), {}),
        result: evaluation.evaluate(...parameterValues),
      };
    });
  }

  public groupTruthTables<V extends string>(tables: TruthTable<V>[]): TruthTable<V>[][] {
    const map: Record<string, TruthTable<V>[]> = {};
    for (const table of tables) {
      const key = Object.keys(table[0]).join('');
      if (map[key]) map[key].push(table);
      else map[key] = [table];
    }

    return Object.values(map);
  }

  public combineTruthTables<V extends string>(...tables: TruthTable<V>[]): CompareTruthTable<V> {
    const result: CompareTruthTable<V> | undefined = tables.shift()?.map((row) => ({ ...row, result: [row.result] }));

    if (!result) throw new Error('no tables given');

    for (let current = tables.shift(); current; current = tables.shift())
      for (let i = 0; i < result?.length; i++) result[i].result.push(current[i].result);

    return result;
  }

  public compareTruthTables<V extends string>(table: TruthTable<V>, compare: TruthTable<V>): boolean {
    if (table.length !== compare.length) return false;
    const zip = table.map((row, i) => [row, compare[i]]);

    for (const [row, compareRow] of zip)
      for (const key of Object.keys(row) as V[]) if (row[key] !== compareRow[key]) return false;

    return true;
  }

  private buildConditionEvaluation(condition: ExpressionKind): {
    evaluate: (...args: boolean[]) => boolean;
    conditions: string[];
  } {
    switch (condition.type) {
      case 'BinaryExpression':
      case 'LogicalExpression':
        const inverse = ConditionService.inverseOperator[condition.operator];
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
        } else if (ValidationService.inverseOperatorSelection.includes(condition.operator) && inverse) {
          condition = { ...condition };
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
          evaluate: (arg) => !!arg,
          conditions: [print(condition).code],
        };
    }
  }

  private truthPermutations<N extends number>(variables: N): (boolean[] & { length: N })[] & { length: N } {
    const result: boolean[][] = [];
    for (let binaryRow = 0; binaryRow < 1 << variables; binaryRow++) {
      result.push(
        Array(variables)
          .fill(false)
          .map((_, i) => !!(binaryRow & (0b1 << i)))
      );
    }

    return result as (boolean[] & { length: N })[] & { length: N };
  }
}
