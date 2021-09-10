import { Suite } from 'mocha';
import * as assert from 'assert';

export default function asyncSuite(name: string, setupSuite: () => Promise<Suite>) {
  suite(`Async dummy Suite for ${name}`, function () {
    let suite: Suite;

    suiteSetup(async () => (suite = await setupSuite()));

    test(`Async tests for ${name} loaded`, async function () {
      assert.ok(suite.suites.length || suite.tests.length);
    });
  });
}
