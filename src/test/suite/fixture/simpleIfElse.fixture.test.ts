import FixtureTestRunner from '../../helpers/FixtureTestRunner';
import asyncSuite from '../../helpers/asyncSuite';

asyncSuite('Fixture tests for simple if else inversion', async function () {
  const suites = await FixtureTestRunner.suiteRunners('simple-if-else', async (text) => text);

  return FixtureTestRunner.suites(suites, this);
});
