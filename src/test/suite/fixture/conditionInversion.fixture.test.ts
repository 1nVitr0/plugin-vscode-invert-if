import FixtureTestRunner from '../../helpers/FixtureTestRunner';
import asyncSuite from '../../helpers/asyncSuite';

asyncSuite('Fixture tests for condition inversion', async function () {
  const suites = await FixtureTestRunner.suiteRunners('condition-inversion', async (text) => text);

  return FixtureTestRunner.suites(suites, this);
});
