import { IfStatementKind } from 'ast-types/gen/kinds';
import { expect } from 'chai';
import ASTService from '../../../services/ASTService';
import ConditionInversionService from '../../../services/ConditionInversionService';
import ConfigurationService from '../../../services/ConfigurationService';
import IfElseInversionService from '../../../services/IfElseInversionService';

suite('Unit tests for IfElseService', () => {
  const multiIfCode = 'if (a == b && c <= d) {} if (c) {} if (d) {}';
  const testCode = 'if (a == b && c <= d) { 1 } else { 2 }';
  const inverseTestCode = 'if (a != b || c > d) { 2 } else { 1 }';

  let configurationService: ConfigurationService;
  let astService: ASTService;
  let inversionService: ConditionInversionService;
  let ifElseInversionService: IfElseInversionService;

  suiteSetup(() => {
    configurationService = new ConfigurationService();
    astService = new ASTService(configurationService);
    inversionService = new ConditionInversionService(configurationService);
    ifElseInversionService = new IfElseInversionService(configurationService, inversionService);
  });

  test('extracts if statements', () => {
    const node = astService.parse(multiIfCode, 'ts');
    const conditions = astService.extractIfBlocks(node);

    expect(conditions.map(({ node }) => node.type)).to.be.members(['IfStatement', 'IfStatement', 'IfStatement']);
  });

  test('inverses if statements', () => {
    const node = astService.parse(testCode, 'ts');
    const inverse = ifElseInversionService.inverse(node.program.body[0] as IfStatementKind);
    const code = astService.stringify(inverse, 'js').replace(/\r?\n|\s+/g, '');

    expect(code).to.equal(inverseTestCode.replace(/\r?\n|\s+/g, ''));
  });
});
