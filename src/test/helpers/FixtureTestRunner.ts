import { resolve } from 'path';
import * as glob from 'glob';
import { readdir, readFile } from 'fs';
import { promisify } from 'util';
import { Suite, Test } from 'mocha';
import { expect } from 'chai';
import LinesAndColumns from 'lines-and-columns';

export type TestFunction = (fixture: string) => Thenable<string>;

export interface Fixture {
  id: string;
  fixture: string;
  expected: string;
  strict?: boolean;
}

export type FixtureSuite = [string, FixtureSuite[] | FixtureTestRunner];

type PartialFixture<T extends 'fixture' | 'expected' | null = null> = Partial<Fixture> &
  Pick<Fixture, T extends null ? 'id' : 'id' | Exclude<T, null>>;

export default class FixtureTestRunner {
  protected static fixtureDir = resolve(__dirname, '../../../test/fixtures');

  public readonly fixtures: Fixture[] = [];

  protected readonly fixtureFile: string;
  protected readonly expectFile: string;

  public static mapRangeToOffset(
    text: string,
    start?: { line: number; column: number },
    end?: { line: number; column: number }
  ): [number, number] {
    const position = new LinesAndColumns(text);
    return [
      position.indexForLocation({
        line: (start?.line || 1) - 1,
        column: start?.column || 0,
      }) || 0,
      position.indexForLocation({
        line: (end?.line || 1) - 1,
        column: end?.column || 0,
      }) || 0,
    ];
  }

  public static suites(suites: FixtureSuite[], context: Suite): Suite[] {
    const self = this;
    const result: Suite[] = [];

    for (const [title, runner] of suites) {
      const suite = new Suite(title);
      if ('length' in runner) for (const inner of self.suites(runner, suite)) suite.addSuite(inner);
      else for (const test of runner.getTests(context)) suite.addTest(test);

      result.push(suite);
    }

    return result;
  }

  /**
   * @param type type of the test (`*` for all tests)
   * @param test test function to transform the fixture string
   */
  public static suiteRunners(type: string, test: TestFunction): Promise<FixtureSuite[]> {
    return new Promise((r, e) => {
      readdir(this.fixtureDir, async (err, langIds) => {
        if (err) return e(err);

        const runners: FixtureSuite[] = [];
        for (const langId of langIds)
          runners.push([`Fixture tests for ${langId}`, await this.suiteRunnersForLanguage(langId, type, test)]);

        r(runners);
      });
    });
  }

  /**
   * @param langId Language Id as specified by the file extension
   * @param type type of the test (`*` for all tests)
   * @param test test function to transform the fixture string
   */
  public static suiteRunnersForLanguage(langId: string, type: string, test: TestFunction): Promise<FixtureSuite[]> {
    return new Promise((r, e) => {
      const languageDir = resolve(this.fixtureDir, langId);
      glob(`${type}.fixture.${langId}`, { cwd: languageDir }, (err, files) => {
        if (err) return e(err);

        const runners = files.map(async (file) => {
          const name = file.replace(`.fixture.${langId}`, '');
          const runner = new this(langId, name, test);
          await runner.init();
          return [name, runner] as FixtureSuite;
        });

        r(Promise.all(runners));
      });
    });
  }

  public constructor(langId: string, fixtureId: string, test: TestFunction);
  public constructor(
    public readonly langId: string,
    public readonly fixtureId: string,
    public readonly test: TestFunction,
    customFixtureDir?: string
  ) {
    const fixtureDir = customFixtureDir || FixtureTestRunner.fixtureDir;
    this.fixtureFile = resolve(fixtureDir, langId, `${fixtureId}.fixture.${langId}`);
    this.expectFile = resolve(fixtureDir, langId, `${fixtureId}.expect.${langId}`);
  }

  public async init() {
    const fixtureContent = (await promisify(readFile)(this.fixtureFile)).toString();
    const expectContent = (await promisify(readFile)(this.expectFile)).toString();

    this.fixtures.push(...this.getFixtures(fixtureContent, expectContent));
  }

  public getTests(context: Suite, forceStrict?: boolean): Test[] {
    const tests: Test[] = [];
    for (const fixture of this.fixtures) {
      if (forceStrict) fixture.strict = forceStrict;

      const { fixtureId: suite, langId: language } = this;

      tests.push(
        new Test(`correctly handles ${fixture.id} on ${suite} (${language})`, async () => {
          await this.runTest(fixture);
        })
      );
    }

    return tests;
  }

  public async runTest(fixture: Fixture, test?: TestFunction) {
    const { fixture: fixtureContent, expected, strict } = fixture;

    const changed = test ? await test(fixtureContent) : await this.test(fixtureContent);

    if (strict) expect(changed).to.equal(expected);
    else expect(changed.replace(/\r?\n|\s+/g, '')).to.equal(expected.replace(/\r?\n|\s+/g, ''));
  }

  protected getFixtures(fixtureContent: string, expectContent: string): Fixture[] {
    const fixtures = this.readPartialFixtures(fixtureContent, 'fixture');
    const expects = this.readPartialFixtures(expectContent, 'expected');

    return fixtures.reduce<Fixture[]>((list, fixture) => {
      const expected = expects.find((item) => item.id === fixture.id) || { ...fixture, expected: '' };
      list.push({ ...fixture, ...expected });
      return list;
    }, []);
  }

  protected readPartialFixtures<T extends 'fixture' | 'expected'>(
    fixtureContent: string,
    type: T
  ): PartialFixture<T>[] {
    const fixtures: PartialFixture[] = [];

    const last = fixtureContent.split(/\r?\n/).reduce<PartialFixture | null>((currentFixture, line) => {
      const fixtureId = line.match(/(?<=@fixture )[\w\d\-\_]+/)?.pop();

      if (fixtureId) {
        if (currentFixture) {
          currentFixture[type] = currentFixture[type]?.slice(0, -1);
          fixtures.push(currentFixture);
        }
        return { id: fixtureId, [type]: '' };
      }

      return (
        currentFixture && {
          ...currentFixture,
          [type]: currentFixture[type] + line + '\n',
        }
      );
    }, null);

    if (last && last[type]) fixtures.push(last);

    return fixtures as PartialFixture<T>[];
  }
}
