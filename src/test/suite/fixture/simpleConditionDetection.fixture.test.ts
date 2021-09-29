import FixtureTestRunner from '../../helpers/FixtureTestRunner';
import asyncSuite from '../../helpers/asyncSuite';
import ASTService from '../../../services/ASTService';
import ConditionService from '../../../services/ConditionService';
import ConfigurationService from '../../../services/ConfigurationService';

asyncSuite('Fixture tests for simple condition detection', async function () {
  const configurationService = new ConfigurationService();
  const astService = new ASTService(configurationService);
  const conditionService = new ConditionService(configurationService);

  const suites = await FixtureTestRunner.suiteRunners('simple-condition-detection', async (code) => {
    const node = astService.parse(code, 'js');
    const conditions = astService.extractConditions(node);

    const replace = conditions.map(({ node }) => {
      const [start, end] = FixtureTestRunner.mapRangeToOffset(code, node.loc?.start, node.loc?.end);
      const inverse = conditionService.inverse(node);
      const inverseCode = astService.stringify(inverse, 'js');

      return { start, end, code: inverseCode };
    });

    let output = '';
    let lastPosition = 0;
    let part: typeof replace[number] | undefined;
    while ((part = replace.shift())) {
      output += code.slice(lastPosition, part.start) + part.code;
      lastPosition = part.end;
    }

    return output + code.slice(lastPosition);
  });

  return FixtureTestRunner.suites(suites, this);
});
