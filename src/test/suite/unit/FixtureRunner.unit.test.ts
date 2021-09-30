import { expect } from 'chai';
import { resolve } from 'path';
import FixtureTestRunner, { TestFunction } from '../../helpers/FixtureTestRunner';
import { Fixture } from '../../helpers/FixtureTestRunner';

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
  let fixture2Ids = ['test-fixture-read2', 'test-fixture-map2', 'test-fixture-unmatched2'];

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

  test('fails on space mismatch in strict mode', async () => {
    const fixture = {
      ...testRunner.fixtures.find((fixture) => fixture.id === 'test-fixture-map'),
      strict: true,
    } as Fixture;
    if (!fixture) throw new Error('fixture "test-fixture-map" not found');

    let err;
    try {
      await testRunner.runTest(fixture, createEditReplace(/CHANGE\-ME/, '  CHANGED  '));
    } catch (e) {
      err = e;
    }

    expect(err).to.not.be.undefined;
  });

  test('reads in only single fixtures from language', async () => {
    const suites = await TestFixtureTestRunner.suiteRunnersForLanguage('js', 'test', passThroughText);
    const testSuite = suites.find(([suite]) => suite === 'test');
    const test2Suite = suites.find(([suite]) => suite === 'test2');
    const tests = testSuite && (testSuite[1] as FixtureTestRunner).fixtures;

    expect(testSuite).to.have.length(2);
    expect(test2Suite).to.be.undefined;
    expect(tests).to.be.instanceOf(Array);
    expect(tests && tests.map(({ id }) => id)).to.deep.equal(fixtureIds);
  });

  test('reads in all fixtures from language', async () => {
    const suites = await TestFixtureTestRunner.suiteRunnersForLanguage('js', '*', passThroughText);
    const testSuite = suites.find(([suite]) => suite === 'test');
    const test2Suite = suites.find(([suite]) => suite === 'test2');
    const tests = testSuite && (testSuite[1] as FixtureTestRunner).fixtures;
    const tests2 = test2Suite && (test2Suite[1] as FixtureTestRunner).fixtures;

    expect(testSuite).to.have.length(2);
    expect(test2Suite).to.have.length(2);
    expect(tests).to.be.instanceOf(Array);
    expect(tests2).to.be.instanceOf(Array);
    expect(tests && tests.map(({ id }) => id)).to.deep.equal(fixtureIds);
    expect(tests2 && tests2.map(({ id }) => id)).to.deep.equal(fixture2Ids);
  });

  test('reads in only single fixture', async () => {
    const suites = await TestFixtureTestRunner.suiteRunners('test', passThroughText);
    const jsSuites = suites.find(([lang]) => lang === 'Fixture tests for js');
    const tsSuites = suites.find(([lang]) => lang === 'Fixture tests for ts');
    const jsTestSuite = jsSuites && 'length' in jsSuites[1] && jsSuites[1].find(([suite]) => suite === 'test');
    const jsTest2Suite = jsSuites && 'length' in jsSuites[1] && jsSuites[1].find(([suite]) => suite === 'test2');
    const tsTestSuite = tsSuites && 'length' in tsSuites[1] && tsSuites[1].find(([suite]) => suite === 'test');
    const jsTests = jsTestSuite && (jsTestSuite[1] as FixtureTestRunner).fixtures;
    const tsTests = tsTestSuite && (tsTestSuite[1] as FixtureTestRunner).fixtures;

    expect(jsSuites).to.have.length(2);
    expect(tsSuites).to.have.length(2);
    expect(jsTest2Suite).to.be.undefined;
    expect(jsTestSuite).to.have.length(2);
    expect(tsTestSuite).to.have.length(2);
    expect(jsTests).to.be.instanceOf(Array);
    expect(tsTests).to.be.instanceOf(Array);

    expect(jsTests && jsTests.map(({ id }) => id)).to.deep.equal(fixtureIds);
    expect(tsTests && tsTests.map(({ id }) => id)).to.deep.equal(fixtureIds);
  });

  test('reads in all fixture', async () => {
    const suites = await TestFixtureTestRunner.suiteRunners('*', passThroughText);
    const jsSuites = suites.find(([lang]) => lang === 'Fixture tests for js');
    const tsSuites = suites.find(([lang]) => lang === 'Fixture tests for ts');
    const jsTestSuite = jsSuites && 'length' in jsSuites[1] && jsSuites[1].find(([suite]) => suite === 'test');
    const jsTest2Suite = jsSuites && 'length' in jsSuites[1] && jsSuites[1].find(([suite]) => suite === 'test2');
    const tsTestSuite = tsSuites && 'length' in tsSuites[1] && tsSuites[1].find(([suite]) => suite === 'test');
    const jsTests = jsTestSuite && (jsTestSuite[1] as FixtureTestRunner).fixtures;
    const jsTests2 = jsTest2Suite && (jsTest2Suite[1] as FixtureTestRunner).fixtures;
    const tsTests = tsTestSuite && (tsTestSuite[1] as FixtureTestRunner).fixtures;

    expect(jsSuites).to.have.length(2);
    expect(tsSuites).to.have.length(2);
    expect(jsTestSuite).to.have.length(2);
    expect(jsTest2Suite).to.have.length(2);
    expect(tsTestSuite).to.have.length(2);
    expect(jsTests).to.be.instanceOf(Array);
    expect(jsTests2).to.be.instanceOf(Array);
    expect(tsTests).to.be.instanceOf(Array);

    expect(jsTests && jsTests.map(({ id }) => id)).to.deep.equal(fixtureIds);
    expect(jsTests2 && jsTests2.map(({ id }) => id)).to.deep.equal(fixture2Ids);
    expect(tsTests && tsTests.map(({ id }) => id)).to.deep.equal(fixtureIds);
  });

  test('get tests respects strict mode', async function () {
    const tests = testRunner.getTests(true);

    expect(tests.length).to.equal(3);
  });

  test('throws error when fixture dir does not exist', async () => {
    // @ts-expect-error
    const previousDir = TestFixtureTestRunner.fixtureDir;
    // @ts-expect-error
    TestFixtureTestRunner.fixtureDir = '__missing';

    let err;
    try {
      await TestFixtureTestRunner.suiteRunners('*{', passThroughText);
    } catch (e) {
      err = e;
    } finally {
      // @ts-expect-error
      TestFixtureTestRunner.fixtureDir = previousDir;
    }

    expect(err).to.not.be.undefined;
  });
});
