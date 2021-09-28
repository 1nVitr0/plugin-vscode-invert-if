import { IfStatementKind } from 'ast-types/gen/kinds';
import { types } from 'recast';
import ConditionService from './ConditionService';
import ConfigurationService from './ConfigurationService';

export default class IfElseService {
  public constructor(
    protected configurationService: ConfigurationService,
    protected conditionService: ConditionService
  ) {}

  public inverse({ test, alternate, consequent }: IfStatementKind): IfStatementKind {
    if (alternate && alternate.type == 'IfStatement') throw new Error('cannot invert if block with else-if statement');
    const inverseCondition = this.conditionService.inverse(test);
    return types.builders.ifStatement(inverseCondition, alternate || types.builders.blockStatement([]), consequent);
  }
}
