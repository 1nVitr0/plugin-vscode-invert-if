import { Suite, Test } from 'mocha';
import * as assert from 'assert';

export default function asyncSuite(name: string, tests: (this: Suite) => Promise<(Suite | Test)[] | Suite | Test>) {
  suite(name, function () {
    const self = this;

    suiteSetup(async () => {
      const children = await tests.bind(self)();
      for (const test of 'length' in children ? children : [children]) {
        if ('type' in test) self.addTest(test);
        else self.addSuite(test);
      }
    });

    test('Async tests loaded', async function () {
      assert.ok(self.suites.length || self.tests.length > 1);
    });
  });
}
