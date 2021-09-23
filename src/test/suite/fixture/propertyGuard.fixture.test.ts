import FixtureTestRunner from '../../helpers/FixtureTestRunner';
import asyncSuite from '../../helpers/asyncSuite';
import ConfigurationService from '../../../services/ConfigurationService';
import ASTService from '../../../services/ASTService';
import ConditionInversionService from '../../../services/ConditionInversionService';
import GuardClauseService from '../../../services/GuardClauseService';

asyncSuite('Fixture tests for property guards', async function () {
  const configurationService = new ConfigurationService();
  const astService = new ASTService(configurationService);
  const conditionInversionService = new ConditionInversionService(configurationService);
  const guardClauseService = new GuardClauseService(configurationService, conditionInversionService);

  const suites = await FixtureTestRunner.suiteRunners('property-guard', async (code) => {
    const node = astService.parse(code, 'js').program.body[0];
    const condition = conditionInversionService.extractConditions(node)[0];
    const guardClause = guardClauseService.moveToGuardClause(node, condition);
    const guardCode = astService.stringify(guardClause, 'js');
    const [start, end] = FixtureTestRunner.mapRangeToOffset(code, condition.loc?.start, condition.loc?.end);

    return code.slice(0, start) + guardCode + code.slice(end);
  });

  return FixtureTestRunner.suites(suites, this);
});
