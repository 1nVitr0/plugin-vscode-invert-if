import * as assert from 'assert';
import { Suite, Test } from 'mocha';

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

    test(`${name} loaded`, function () {
      assert.ok(self.suites.length || self.tests.length - 1);

      // Regenerate description to dynamically reflect async test / suite counts
      let description = (self.suites.length && ` ${self.suites.length} suite(s)`) || '';
      if (self.tests.length > 1) description += (description && ' and') + ` ${self.tests.length - 1} test(s)`;
      if (this.test) this.test.title += description;
    });
  });
}
