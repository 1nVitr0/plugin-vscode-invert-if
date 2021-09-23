import { expect } from 'chai';
import ASTService from '../../../services/ASTService';
import ConfigurationService from '../../../services/ConfigurationService';
import ConditionInversionService from '../../../services/ConditionInversionService';
import { ProgramKind } from 'ast-types/gen/kinds';

suite('Unit tests for ASTService', () => {
  let configurationService: ConfigurationService;
  let astService: ASTService;
  let inversionService: ConditionInversionService;

  const testCode = 'if (a == b && c <= d) {}';
  const testCodeNode = {
    type: 'Program',
    body: [
      {
        type: 'IfStatement',
        test: {
          type: 'LogicalExpression',
          operator: '&&',
          left: {
            type: 'BinaryExpression',
            operator: '==',
            left: { type: 'Identifier', name: 'a' },
            right: { type: 'Identifier', name: 'b' },
          },
          right: {
            type: 'BinaryExpression',
            operator: '<=',
            left: { type: 'Identifier', name: 'c' },
            right: { type: 'Identifier', name: 'd' },
          },
        },
        consequent: { type: 'BlockStatement', body: [] },
        alternate: null,
      },
    ],
    sourceType: 'script',
    errors: [],
  };

  suiteSetup(() => {
    configurationService = new ConfigurationService();
    astService = new ASTService(configurationService);
    inversionService = new ConditionInversionService(configurationService);
  });

  test('parses valid js Code', () => {
    const node = astService.parse(testCode, 'js');
    const program: ProgramKind & { errors?: any[] } = node.program;
    const stripped = astService.stripAttributes(program, ['original', 'loc', 'tokens']);

    expect(!!('errors' in stripped && stripped.errors?.length)).to.be.false;
    expect(stripped).to.deep.equal(testCodeNode);
  });

  test('generates valid js Code', () => {
    const node = astService.parse(testCode, 'js');
    const code = astService.stringify(node, 'js');
    expect(code).to.equal(testCode);
  });
});
