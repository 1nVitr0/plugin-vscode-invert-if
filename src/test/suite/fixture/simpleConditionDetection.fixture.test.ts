import FixtureTestRunner from '../../helpers/FixtureTestRunner';
import asyncSuite from '../../helpers/asyncSuite';

asyncSuite('Fixture tests for simple condition detection', async function () {
  const suites = await FixtureTestRunner.suiteRunners('simple-condition-detection', async (text) => text);

  return FixtureTestRunner.suites(suites, this);
});
