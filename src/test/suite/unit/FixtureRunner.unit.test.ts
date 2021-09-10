import { expect } from 'chai';
import { resolve } from 'path';
import FixtureTestRunner, { TestFunction } from '../../helpers/FixtureTestRunner';

class TestFixtureTestRunner extends FixtureTestRunner {
  protected static fixtureDir = resolve(__dirname, '../../../../test/fixtureTests');

  public constructor(langId: string, fixtureId: string, test: TestFunction) {
    // @ts-ignore override fixture dir using "hidden" constructor parameter
    super(langId, fixtureId, test, TestFixtureTestRunner.fixtureDir);
  }
}

async function passThroughText(text: string) {
  return text;
}

function createEditReplace(regex: RegExp, replace: string): TestFunction {
  return async (text) => text.replace(regex, replace);
}

suite('FixtureTestRunner unit tests', () => {
  let testRunner: TestFixtureTestRunner;
  let fixtureIds = ['test-fixture-read', 'test-fixture-map', 'test-fixture-unmatched'];

  suiteSetup(async () => {
    testRunner = new TestFixtureTestRunner('js', 'test', passThroughText);
    await testRunner.init();
  });

  test('reads tests form fixture', async () => {
    expect(testRunner.fixtures.map(({ id }) => id)).to.have.deep.members(fixtureIds);
  });

  test('has empty unmatched expect', async () => {
    const fixture = testRunner.fixtures.find((fixture) => fixture.id === 'test-fixture-unmatched');
    if (!fixture) throw new Error('fixture "test-fixture-unmatched" not found');

    expect(fixture.expected).to.be.empty;
    expect(fixture.fixture).to.not.be.empty;
  });

  test('throws on invalid edit', async () => {
    const fixture = testRunner.fixtures.find((fixture) => fixture.id === 'test-fixture-read');
    if (!fixture) throw new Error('fixture "test-fixture-read" not found');

    let err;
    try {
      await testRunner.runTest(fixture, createEditReplace(/.*/gm, 'REPLACED'));
    } catch (e) {
      err = e;
    }

    expect(err).to.be;
  });

  test('detects correct edits', async () => {
    const fixture = testRunner.fixtures.find((fixture) => fixture.id === 'test-fixture-map');
    if (!fixture) throw new Error('fixture "test-fixture-map" not found');

    await testRunner.runTest(fixture, createEditReplace(/CHANGE\-ME/, 'CHANGED'));
  });

  test('reads in fixtures from language', async () => {
    const suites = await TestFixtureTestRunner.suitesForLanguage('js', passThroughText);
    const testSuite = suites.find(([suite]) => suite === 'test');
    const tests = testSuite && (testSuite[1] as FixtureTestRunner).fixtures;

    expect(testSuite).to.have.length(2);
    expect(tests).to.be.instanceOf(Array);
    expect(tests && tests.map(({ id }) => id)).to.deep.equal(fixtureIds);
  });

  test('reads in all fixture', async () => {
    const suites = await TestFixtureTestRunner.suites(passThroughText);
    const jsSuites = suites.find(([lang]) => lang === 'Fixture tests for js');
    const tsSuites = suites.find(([lang]) => lang === 'Fixture tests for ts');
    const jsTestSuite = jsSuites && 'length' in jsSuites[1] && jsSuites[1].find(([suite]) => suite === 'test');
    const tsTestSuite = tsSuites && 'length' in tsSuites[1] && tsSuites[1].find(([suite]) => suite === 'test');
    const jsTests = jsTestSuite && (jsTestSuite[1] as FixtureTestRunner).fixtures;
    const tsTests = tsTestSuite && (tsTestSuite[1] as FixtureTestRunner).fixtures;

    expect(jsSuites).to.have.length(2);
    expect(tsSuites).to.have.length(2);
    expect(jsTestSuite).to.have.length(2);
    expect(tsTestSuite).to.have.length(2);
    expect(jsTests).to.be.instanceOf(Array);
    expect(tsTests).to.be.instanceOf(Array);

    expect(jsTests && jsTests.map(({ id }) => id)).to.deep.equal(fixtureIds);
    expect(tsTests && tsTests.map(({ id }) => id)).to.deep.equal(fixtureIds);
  });
});
