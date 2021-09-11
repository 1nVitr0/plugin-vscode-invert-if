// import * as myExtension from '../../extension';
import FixtureTestRunner from '../helpers/FixtureTestRunner';
import asyncSuite from '../helpers/asyncSuite';

asyncSuite('Fixture Test Suite', async function () {
  const suites = await FixtureTestRunner.suiteRunners(async (text) => text);

  return FixtureTestRunner.suites(suites, this);
});
