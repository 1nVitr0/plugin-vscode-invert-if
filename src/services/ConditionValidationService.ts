import { Node } from 'acorn';
import ConfigurationService from './ConfigurationService';

export type TruthTable<V extends string> = { [key in V | 'result']: boolean }[];
export default class ConditionValidationService {
  public constructor(private configurationService: ConfigurationService) {}

  public verifyEqual(condition: Node, compare: Node): boolean {
    throw new Error('not implemented');
  }

  public verifyInverse(condition: Node, inverse: Node): boolean {
    throw new Error('not implemented');
  }

  public generateTruthTable(condition: Node): TruthTable<string> {
    throw new Error('not implemented');
  }

  public compareTruthTables<V extends string>(table: TruthTable<V>, compare: TruthTable<V>): boolean {
    throw new Error('not implemented');
  }
}
