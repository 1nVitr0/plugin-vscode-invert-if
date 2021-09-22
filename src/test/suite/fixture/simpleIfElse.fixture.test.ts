import { IfStatementKind } from 'ast-types/gen/kinds';
import ASTService from '../../../services/ASTService';
import ConditionInversionService from '../../../services/ConditionInversionService';
import ConfigurationService from '../../../services/ConfigurationService';
import IfElseInversionService from '../../../services/IfElseInversionService';
import asyncSuite from '../../helpers/asyncSuite';
import FixtureTestRunner from '../../helpers/FixtureTestRunner';

asyncSuite('Fixture tests for simple if else inversion', async function () {
  const configurationService = new ConfigurationService();
  const astService = new ASTService(configurationService);
  const conditionInversionService = new ConditionInversionService(configurationService);
  const ifElseInversionService = new IfElseInversionService(configurationService, conditionInversionService);

  const suites = await FixtureTestRunner.suiteRunners('simple-if-else', async (code) => {
    const node = astService.parse(code, 'js');
    const inverse = ifElseInversionService.inverse(node.program.body[0] as IfStatementKind);

    return astService.stringify(inverse, 'js');
  });

  return FixtureTestRunner.suites(suites, this);
});
