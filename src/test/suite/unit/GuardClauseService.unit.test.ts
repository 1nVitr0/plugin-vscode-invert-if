import { expect } from 'chai';
import ASTService from '../../../services/ASTService';
import ConfigurationService from '../../../services/ConfigurationService';
import ConditionInversionService from '../../../services/ConditionInversionService';
import GuardClauseService, { GuardClausePosition } from '../../../services/GuardClauseService';
import { GuardClauseType } from '../../../services/GuardClauseService';
import { IdentifierKind, IfStatementKind, WhileStatementKind } from 'ast-types/gen/kinds';
import { visit } from 'ast-types';

suite('Unit tests for GuardClauseService', () => {
  const forLoopCode = 'for (let i = 0; i < 10; i++) {}';
  const whileLoopCode = 'while (i < 10) { i++; }';
  const doWhileLoopCode = 'do { i++; } while (i < 10)';
  const functionCode = 'function test() { if (a && b) {} }';
  const ifCode = 'if (a) {}';

  let configurationService: ConfigurationService;
  let astService: ASTService;
  let inversionService: ConditionInversionService;
  let guardClauseService: GuardClauseService;

  suiteSetup(() => {
    configurationService = new ConfigurationService();
    astService = new ASTService(configurationService);
    inversionService = new ConditionInversionService(configurationService);
    guardClauseService = new GuardClauseService(configurationService, inversionService);
  });

  test('detects guard clause for loops', () => {
    expect(guardClauseService.detectGuardClauseType(astService.parse(forLoopCode, 'js').program.body[0])).to.equal(
      GuardClauseType.break
    );
    expect(guardClauseService.detectGuardClauseType(astService.parse(whileLoopCode, 'js').program.body[0])).to.equal(
      GuardClauseType.break
    );
    expect(guardClauseService.detectGuardClauseType(astService.parse(doWhileLoopCode, 'js').program.body[0])).to.equal(
      GuardClauseType.break
    );
  });

  test('detects guard clause for functions', () => {
    expect(guardClauseService.detectGuardClauseType(astService.parse(functionCode, 'js').program.body[0])).to.equal(
      GuardClauseType.return
    );
  });

  test('detects guard clause for other statements', () => {
    expect(guardClauseService.detectGuardClauseType(astService.parse(ifCode, 'js').program.body[0])).to.equal(
      GuardClauseType.return
    );
  });

  test('generates break guard clause', () => {
    const node = astService.parse(ifCode, 'js').program.body[0] as IfStatementKind;
    const condition = node.test;
    const guardClause = guardClauseService.toGuardClause(condition, GuardClauseType.break);

    expect(guardClause.test).to.deep.equal(condition);
    expect(guardClause.consequent.type).to.equal('BreakStatement');
  });

  test('generates continue guard clause', () => {
    const node = astService.parse(ifCode, 'js').program.body[0] as IfStatementKind;
    const condition = node.test;
    const guardClause = guardClauseService.toGuardClause(condition, GuardClauseType.continue);

    expect(guardClause.test).to.deep.equal(condition);
    expect(guardClause.consequent.type).to.equal('ContinueStatement');
  });

  test('generates return guard clause', () => {
    const node = astService.parse(ifCode, 'js').program.body[0] as IfStatementKind;
    const condition = node.test;
    const guardClause = guardClauseService.toGuardClause(condition, GuardClauseType.return);

    expect(guardClause.test).to.deep.equal(condition);
    expect(guardClause.consequent.type).to.equal('ReturnStatement');
  });

  test('generates guard clause for loops', () => {
    const node = astService.parse(whileLoopCode, 'js').program.body[0] as WhileStatementKind;
    const condition = node.test;
    const withGuardClause = guardClauseService.moveToGuardClause(
      node,
      condition,
      GuardClausePosition.append,
      GuardClauseType.break
    );

    let _guardClause: IfStatementKind | null = null;
    visit(withGuardClause, { visitIfStatement: (path) => (_guardClause = path.node) });

    const guardClause = _guardClause as unknown as IfStatementKind | null;

    expect(guardClause?.test).to.deep.equal(condition);
    expect(guardClause?.consequent.type).to.equal('BreakStatement');
  });

  test('generates guard clause for other nodes', () => {
    const node: any = astService.parse(functionCode, 'js').program.body[0];
    const condition: IdentifierKind = node.body.body[0].test.left;
    const withGuardClause = guardClauseService.moveToGuardClause(
      node,
      condition,
      GuardClausePosition.append,
      GuardClauseType.break
    );

    let _guardClause: IfStatementKind | null = null;
    visit(withGuardClause, { visitIfStatement: (path) => (_guardClause = path.node) });

    const guardClause = _guardClause as unknown as IfStatementKind | null;

    expect(guardClause?.test).to.deep.equal(condition);
    expect(guardClause?.consequent.type).to.equal('BreakStatement');
  });

  test('replaces empty loops with true', () => {
    const node = astService.parse(whileLoopCode, 'js').program.body[0] as WhileStatementKind;
    const condition = node.test;
    const withGuardClause = guardClauseService.moveToGuardClause(node, condition);

    expect(astService.stripAttributes(withGuardClause.test)).to.deep.equal({
      type: 'Literal',
      value: true,
      comments: null,
      regex: null,
    });
  });

  test('removes condition from original expression', () => {
    const node: any = astService.parse(functionCode, 'js').program.body[0];
    const condition: IdentifierKind = node.body.body[0].test.left;
    const withGuardClause = guardClauseService.moveToGuardClause(node, condition, GuardClausePosition.append);

    expect(
      astService.stripAttributes(withGuardClause.body.body[0].test, ['original', 'loc', 'tokens', 'right'])
    ).to.deep.equal({
      type: 'Identifier',
      name: 'b',
      optional: false,
      typeAnnotation: null,
    });
  });

  test('removes empty if conditions', () => {
    const node: any = astService.parse(functionCode, 'js').program.body[0];
    const condition: IdentifierKind = node.body.body[0].test;
    const withGuardClause = guardClauseService.moveToGuardClause(node, condition);

    expect(withGuardClause.body.body.pop().body?.length).to.equal(0);
  });
});
