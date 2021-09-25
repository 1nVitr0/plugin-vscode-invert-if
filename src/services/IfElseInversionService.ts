import { IfStatementKind } from 'ast-types/gen/kinds';
import { types } from 'recast';
import ConditionInversionService from './ConditionInversionService';
import ConfigurationService from './ConfigurationService';

export default class IfElseInversionService {
  public constructor(
    protected configurationService: ConfigurationService,
    protected conditionInversionService: ConditionInversionService
  ) {}

  public inverse({ test, alternate, consequent }: IfStatementKind): IfStatementKind {
    if (alternate && alternate.type == 'IfStatement') throw new Error('cannot invert if block with else-if statement');
    const inverseCondition = this.conditionInversionService.inverse(test);
    return types.builders.ifStatement(inverseCondition, alternate || types.builders.blockStatement([]), consequent);
  }
}
