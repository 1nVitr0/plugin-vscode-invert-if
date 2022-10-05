import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';
import { join, resolve } from 'path';

async function setupCoverage() {
  const { loadNycConfig } = require('@istanbuljs/load-nyc-config');
  const NYC = require('nyc');
  const options = await loadNycConfig({ cwd: join(__dirname, '..', '..', '..') });
  const nyc = new NYC(options);

  nyc.reset();
  nyc.wrap();

  return nyc;
}

export async function run(): Promise<void> {
  const nyc = process.env.COVERAGE ? await setupCoverage() : null;
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
  });

  const testsRoot = path.resolve(__dirname, '..');
  const files = glob.sync('**/**.test.js', { cwd: testsRoot });

  // Add files to the test suite
  files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

  try {
    // Run the mocha test
    await new Promise<void>((c, e) => {
      mocha.run((failures) => {
        if (failures > 0) e(new Error(`${failures} tests failed.`));
        else c();
      });
    });
  } catch (err) {
    throw err;
  } finally {
    if (nyc) {
      nyc.writeCoverageFile();
      await nyc.report();
    }
  }
}
