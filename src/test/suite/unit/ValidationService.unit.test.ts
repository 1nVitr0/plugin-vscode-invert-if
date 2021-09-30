import { ExpressionKind, IfStatementKind } from 'ast-types/gen/kinds';
import { expect } from 'chai';
import ASTService from '../../../services/ASTService';
import ValidationService from '../../../services/ValidationService';
import ConfigurationService from '../../../services/ConfigurationService';

suite('Unit tests for ValidationService', () => {
  let configurationService: ConfigurationService;
  let astService: ASTService;
  let validationService: ValidationService;

  const testCode = 'if (a == b && c <= d) {}';
  const inverseTestCode = 'if (a != b || c > d) {}';

  suiteSetup(() => {
    configurationService = new ConfigurationService();
    astService = new ASTService(configurationService);
    validationService = new ValidationService(configurationService);
  });

  test('generates truth table', () => {
    const node = astService.parse(testCode, 'js');
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const table = validationService.generateTruthTable(statement.test as ExpressionKind);

    expect(table).to.deep.equal([
      { 'a == b': false, 'c > d': false, result: false },
      { 'a == b': true, 'c > d': false, result: true },
      { 'a == b': false, 'c > d': true, result: false },
      { 'a == b': true, 'c > d': true, result: false },
    ]);
  });

  test('generates same truth table parameters for inverse', () => {
    const node = astService.parse(testCode, 'js');
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const table = validationService.generateTruthTable(statement.test as ExpressionKind);

    const inverseNode = astService.parse(inverseTestCode, 'js');
    const inverseStatement: IfStatementKind = inverseNode.program.body[0] as IfStatementKind;
    const inverseTable = validationService.generateTruthTable(inverseStatement.test as ExpressionKind);

    expect(Object.keys(table[0])).to.deep.equal(Object.keys(inverseTable[0]));
  });

  test('compares truth tables', () => {
    const node = astService.parse(testCode, 'js');
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const table = validationService.generateTruthTable(statement.test as ExpressionKind);
    const compare = validationService.generateTruthTable(statement.test as ExpressionKind);

    expect(validationService.compareTruthTables(table, compare)).to.be.true;
  });

  test('validate tables', () => {
    const node = astService.parse(testCode, 'js');
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;

    expect(validationService.validateEqual(statement.test, statement.test)).to.be.true;
  });

  test('validate inverse tables', () => {
    const node = astService.parse(testCode, 'js');
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const inverseNode = astService.parse(inverseTestCode, 'js');
    const inverseStatement: IfStatementKind = inverseNode.program.body[0] as IfStatementKind;

    expect(validationService.validateInverse(statement.test, inverseStatement.test)).to.be.true;
  });
});
