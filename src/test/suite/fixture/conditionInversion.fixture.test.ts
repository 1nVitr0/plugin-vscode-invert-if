import ASTService from '../../../services/ASTService';
import ConditionService from '../../../services/ConditionService';
import ConfigurationService from '../../../services/ConfigurationService';
import asyncSuite from '../../helpers/asyncSuite';
import FixtureTestRunner from '../../helpers/FixtureTestRunner';

asyncSuite('Fixture tests for condition inversion', async function () {
  const configurationService = new ConfigurationService();
  const astService = new ASTService(configurationService);
  const conditionService = new ConditionService(configurationService);

  const suites = await FixtureTestRunner.suiteRunners('condition-inversion', async (code) => {
    const node = astService.parse(code, 'js');
    const condition = astService.extractConditions(node)[0];
    const inverse = conditionService.inverse(condition.node);
    const inverseCode = astService.stringify(inverse, 'js');
    const [start, end] = FixtureTestRunner.mapRangeToOffset(code, condition.node.loc?.start, condition.node.loc?.end);

    return code.slice(0, start) + inverseCode + code.slice(end);
  });

  return FixtureTestRunner.suites(suites, this);
});
