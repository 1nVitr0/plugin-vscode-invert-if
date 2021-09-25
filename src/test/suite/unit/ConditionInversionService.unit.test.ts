import { IfStatementKind } from 'ast-types/gen/kinds';
import { expect } from 'chai';
import ASTService from '../../../services/ASTService';
import ConditionInversionService from '../../../services/ConditionInversionService';
import ConfigurationService from '../../../services/ConfigurationService';

suite('Unit tests for ASTService', () => {
  let configurationService: ConfigurationService;
  let astService: ASTService;
  let inversionService: ConditionInversionService;

  suiteSetup(() => {
    configurationService = new ConfigurationService();
    astService = new ASTService(configurationService);
    inversionService = new ConditionInversionService(configurationService);
  });

  test('extracts conditions', () => {
    const node = astService.parse('if (a) {} else if (b) {} else if (c) {}', 'js');
    const conditions = astService.extractConditions(node);

    expect(conditions.length).to.equal(3);
  });

  test('extracts nested conditions', () => {
    const node = astService.parse('if (a) { if (b) { if (c) {} } }', 'js');
    const conditions = astService.extractConditions(node);

    expect(conditions.length).to.equal(3);
  });

  test('extracts conditions respects max', () => {
    const node = astService.parse('if (a) { if (b) { if (c) {} } }', 'js');
    const conditions = astService.extractConditions(node, null, 2);

    expect(conditions.length).to.equal(2);
  });

  test('inverses conditions', () => {
    const node = astService.parse('if (a == b) {}', 'js');
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const inverse = inversionService.inverse(statement.test);

    expect(astService.stringify(inverse, 'js')).to.equal('a != b');
  });

  test('inverses groups', () => {
    const node = astService.parse('if (a == b && c == d && e == f) {}', 'js');
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const inverse = inversionService.inverseGroup(statement.test);

    expect(astService.stringify(inverse, 'js')).to.equal('!(a == b && c == d && e == f)');
  });

  test('inverse respects depth', () => {
    const node = astService.parse('if (a == b && c == d && e == f) {}', 'js');
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const inverse = inversionService.inverse(statement.test, 1);

    expect(astService.stringify(inverse, 'js')).to.equal('!(a == b && c == d) || !(e == f)');
  });
});
