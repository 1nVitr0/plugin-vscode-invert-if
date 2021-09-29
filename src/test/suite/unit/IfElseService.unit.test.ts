import { IfStatementKind } from 'ast-types/gen/kinds';
import { expect } from 'chai';
import ASTService from '../../../services/ASTService';
import ConditionService from '../../../services/ConditionService';
import ConfigurationService from '../../../services/ConfigurationService';
import IfElseService from '../../../services/IfElseService';

suite('Unit tests for IfElseService', () => {
  const multiIfCode = 'if (a == b && c <= d) {} if (c) {} if (d) {}';
  const testCode = 'if (a == b && c <= d) { 1 } else { 2 }';
  const inverseTestCode = 'if (a != b || c > d) { 2 } else { 1 }';
  const chainTestCode =
    'if (a) { if(b) { if (c) { d } else if (c1) { c2 } else { c3 } } else if (b1) { b2 } else { b3 } } else if (a1) { a2 } else { a3 }';
  const chainExpectCode =
    'if (a && b && c) { d } else if (a && b && c1) { c2 } else if (a && b1) { b2 } else if (a1) { a2 } else { a3 }';

  let configurationService: ConfigurationService;
  let astService: ASTService;
  let conditionService: ConditionService;
  let ifElseService: IfElseService;

  suiteSetup(() => {
    configurationService = new ConfigurationService();
    astService = new ASTService(configurationService);
    conditionService = new ConditionService(configurationService);
    ifElseService = new IfElseService(configurationService, astService, conditionService);
  });

  test('extracts if statements', () => {
    const node = astService.parse(multiIfCode, 'ts');
    const conditions = astService.extractIfBlocks(node);

    expect(conditions.map(({ node }) => node.type)).to.be.members(['IfStatement', 'IfStatement', 'IfStatement']);
  });

  test('inverses if statements', () => {
    const node = astService.parse(testCode, 'ts');
    const inverse = ifElseService.inverse(node.program.body[0] as IfStatementKind);
    const code = astService.stringify(inverse, 'js').replace(/\r?\n|\s+/g, '');

    expect(code).to.equal(inverseTestCode.replace(/\r?\n|\s+/g, ''));
  });

  test.only('merges if statements', () => {
    const node = astService.parse(chainTestCode, 'ts');
    const conditions = astService.extractIfBlocks(node).map(({ node }) => node);
    const parent = conditions.shift() || conditions[0];

    const merged = ifElseService.combine(parent, ...conditions);
    const code = astService.stringify(merged, 'js').replace(/\r?\n|\s+/g, '');
    expect(code).to.equal(inverseTestCode.replace(/\r?\n|\s+/g, ''));
  });
});
