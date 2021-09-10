import { resolve } from 'path';
import * as glob from 'glob';
import { readdir, readFile } from 'fs';
import { promisify } from 'util';
import { Suite } from 'mocha';
import { expect } from 'chai';

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

  public static async runSuites(suites: FixtureSuite[], context: Suite): Promise<void> {
    const self = this;

    for (const [title, runner] of suites) {
      suite(title, function () {
        if ('length' in runner) self.runSuites(runner, this);
        else runner.run(context);
      });
    }
  }

  public static suites(test: TestFunction): Promise<FixtureSuite[]> {
    return new Promise((r, e) => {
      readdir(this.fixtureDir, async (err, langIds) => {
        if (err) return e(err);

        const runners: FixtureSuite[] = [];
        for (const langId of langIds)
          runners.push([`Fixture tests for ${langId}`, await this.suitesForLanguage(langId, test)]);

        r(runners);
      });
    });
  }

  public static suitesForLanguage(langId: string, test: TestFunction): Promise<FixtureSuite[]> {
    return new Promise((r, e) => {
      const ĺanguageDir = resolve(this.fixtureDir, langId);
      glob(`*.fixture.${langId}`, { cwd: ĺanguageDir }, (err, files) => {
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

  public run(context: Suite, forceStrict?: boolean) {
    for (const fixture of this.fixtures) {
      if (forceStrict) fixture.strict = forceStrict;

      const { fixtureId: suite, langId: language } = this;

      test.bind(context)(`correctly handles ${fixture.id} on ${suite} (${language})`, async () => {
        await this.runTest(fixture);
      });
    }
  }

  public async runTest(fixture: Fixture, test?: TestFunction) {
    const { fixture: fixtureContent, expected, strict } = fixture;

    const changed = test ? await test(fixtureContent) : await this.test(fixtureContent);

    if (strict) expect(changed).to.equal(expected);
    else expect(changed.replace(/\r?\n/, '')).to.equal(expected.replace(/\r?\n/, ''));
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
        if (currentFixture) fixtures.push(currentFixture);
        return { id: fixtureId, [type]: '' };
      }

      return (
        currentFixture && {
          ...currentFixture,
          [type]: currentFixture[type] + line,
        }
      );
    }, null);

    if (last && last[type]) fixtures.push(last);

    return fixtures as PartialFixture<T>[];
  }
}
