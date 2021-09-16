import FixtureTestRunner from '../../helpers/FixtureTestRunner';
import asyncSuite from '../../helpers/asyncSuite';

asyncSuite('Fixture tests for property guards', async function () {
  const suites = await FixtureTestRunner.suiteRunners('property-guard', async (text) => text);

  return FixtureTestRunner.suites(suites, this);
});
