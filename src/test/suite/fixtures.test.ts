// import * as myExtension from '../../extension';
import FixtureTestRunner from '../helpers/FixtureTestRunner';
import asyncSuite from '../helpers/asyncSuite';

asyncSuite('fixture tests', async function () {
  const suites = await FixtureTestRunner.suites(async (text) => text);

  return suite('Fixture Test Suite', function () {
    FixtureTestRunner.runSuites(suites, this);
  });
});
