import ASTService from '../../../services/ASTService';
import ConditionInversionService from '../../../services/ConditionInversionService';
import ConfigurationService from '../../../services/ConfigurationService';
import asyncSuite from '../../helpers/asyncSuite';
import FixtureTestRunner from '../../helpers/FixtureTestRunner';

asyncSuite('Fixture tests for condition inversion', async function () {
  const configurationService = new ConfigurationService();
  const astService = new ASTService(configurationService);
  const conditionInversionService = new ConditionInversionService(configurationService);

  const suites = await FixtureTestRunner.suiteRunners('condition-inversion', async (code) => {
    const node = astService.parse(code, 'js');
    const condition = conditionInversionService.extractConditions(node)[0];
    const inverse = conditionInversionService.inverse(condition);
    const inverseCode = astService.stringify(inverse, 'js');
    const [start, end] = FixtureTestRunner.mapRangeToOffset(code, condition.loc?.start, condition.loc?.end);

    return code.slice(0, start) + inverseCode + code.slice(end);
  });

  return FixtureTestRunner.suites(suites, this);
});
