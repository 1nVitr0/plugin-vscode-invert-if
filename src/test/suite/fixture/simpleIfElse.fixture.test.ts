import { IfStatementKind } from 'ast-types/gen/kinds';
import ASTService from '../../../services/ASTService';
import ConditionService from '../../../services/ConditionService';
import ConfigurationService from '../../../services/ConfigurationService';
import IfElseService from '../../../services/IfElseService';
import asyncSuite from '../../helpers/asyncSuite';
import FixtureTestRunner from '../../helpers/FixtureTestRunner';

asyncSuite('Fixture tests for simple if else inversion', async function () {
  const configurationService = new ConfigurationService();
  const astService = new ASTService(configurationService);
  const conditionService = new ConditionService(configurationService);
  const ifElseService = new IfElseService(configurationService, astService, conditionService);

  const suites = await FixtureTestRunner.suiteRunners('simple-if-else', async (code) => {
    const node = astService.parse(code, 'js');
    const inverse = ifElseService.inverse(node.program.body[0] as IfStatementKind);

    return astService.stringify(inverse, 'js');
  });

  return FixtureTestRunner.suites(suites, this);
});
