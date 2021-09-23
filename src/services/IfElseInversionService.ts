import { IfStatementKind } from 'ast-types/gen/kinds';
import { types } from 'recast';
import ConditionInversionService from './ConditionInversionService';
import ConfigurationService from './ConfigurationService';

export default class IfElseInversionService {
  public constructor(
    protected configurationService: ConfigurationService,
    protected conditionInversionService: ConditionInversionService
  ) {}

  public extractIfBlocks(node: types.ASTNode): IfStatementKind[] {
    throw new Error('not implemented');
  }

  public inverse({ test, alternate, consequent }: IfStatementKind): IfStatementKind {
    const inverseCondition = this.conditionInversionService.inverse(test);
    return types.builders.ifStatement(inverseCondition, alternate || types.builders.blockStatement([]), consequent);
  }
}
