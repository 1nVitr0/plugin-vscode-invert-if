import { NodePath, visit } from 'ast-types';
import { IfStatementKind, WhileStatementKind } from 'ast-types/gen/kinds';
import { expect } from 'chai';
import ASTService from '../../../services/ASTService';
import ConditionService from '../../../services/ConditionService';
import ConfigurationService from '../../../services/ConfigurationService';
import GuardClauseService, { GuardClausePosition, GuardClauseType } from '../../../services/GuardClauseService';

suite('Unit tests for GuardClauseService', () => {
  const forLoopCode = 'for (let i = 0; i < 10; i++) {}';
  const whileLoopCode = 'while (i < 10) { i++; }';
  const doWhileLoopCode = 'do { i++; } while (i < 10)';
  const functionCode = 'function test() { if (a && b) {} }';
  const functionIfElseCode = 'function test() { if (a && b) { c } else { d } }';
  const functionIfElseSimpleCode = 'function test() { if (a && b) c; else d }';
  const functionMultiConditionCode = 'function test() { if (a && b && c) {} }';
  const ifCode = 'if (a) {}';

  let configurationService: ConfigurationService;
  let astService: ASTService;
  let conditionService: ConditionService;
  let guardClauseService: GuardClauseService;

  suiteSetup(() => {
    configurationService = new ConfigurationService();
    astService = new ASTService(configurationService);
    conditionService = new ConditionService(configurationService);
    guardClauseService = new GuardClauseService(configurationService, astService, conditionService);
  });

  test('detects guard clause for loops', () => {
    expect(
      guardClauseService.detectGuardClauseType(new NodePath(astService.parse(forLoopCode, 'js').program.body[0]))
    ).to.equal(GuardClauseType.break);
    expect(
      guardClauseService.detectGuardClauseType(new NodePath(astService.parse(whileLoopCode, 'js').program.body[0]))
    ).to.equal(GuardClauseType.break);
    expect(
      guardClauseService.detectGuardClauseType(new NodePath(astService.parse(doWhileLoopCode, 'js').program.body[0]))
    ).to.equal(GuardClauseType.break);
  });

  test('detects guard clause for functions', () => {
    expect(
      guardClauseService.detectGuardClauseType(new NodePath(astService.parse(functionCode, 'js').program.body[0]))
    ).to.equal(GuardClauseType.return);
  });

  test('detects guard clause for other statements', () => {
    expect(
      guardClauseService.detectGuardClauseType(new NodePath(astService.parse(ifCode, 'js').program.body[0]))
    ).to.equal(GuardClauseType.return);
  });

  test('detects guard clause position', () => {
    const block = new NodePath(astService.parse(functionCode, 'js').program.body[0]);
    const condition = astService.extractConditions(block.node, null, 1)[0];
    expect(guardClauseService.detectGuardClausePosition(block, condition)).to.equal(GuardClausePosition.keep);
  });

  test("generates break guard clause", () => {
    const node = astService.parse(ifCode, "js").program.body[0] as IfStatementKind;
    const condition = node.test;
    const guardClause = guardClauseService.getGuardClauseCondition(condition, GuardClauseType.break);

    expect(guardClause.consequent.type).to.equal("BreakStatement");
  });

  test("generates continue guard clause", () => {
    const node = astService.parse(ifCode, "js").program.body[0] as IfStatementKind;
    const condition = node.test;
    const guardClause = guardClauseService.getGuardClauseCondition(condition, GuardClauseType.continue);

    expect(guardClause.consequent.type).to.equal("ContinueStatement");
  });

  test('generates return guard clause', () => {
    const node = astService.parse(ifCode, 'js').program.body[0] as IfStatementKind;
    const condition = node.test;
    const guardClause = guardClauseService.getGuardClauseCondition(condition, GuardClauseType.return);

    expect(guardClause.consequent.type).to.equal('ReturnStatement');
  });

  test('generates guard clause for loops', () => {
    const node = astService.parse(whileLoopCode, 'js').program.body[0] as WhileStatementKind;
    const path = new NodePath(node);
    const condition = path.get('test');
    const withGuardClause = guardClauseService.moveToGuardClause(
      path,
      condition,
      GuardClausePosition.append,
      GuardClauseType.break
    );

    let _guardClause: IfStatementKind | null = null;
    visit(withGuardClause.node, { visitIfStatement: (path) => (_guardClause = path.node) });

    const guardClause = _guardClause as unknown as IfStatementKind | null;

    expect(guardClause?.consequent.type).to.equal('BreakStatement');
  });

  test('generates guard clause for other nodes', () => {
    const path = new NodePath(astService.parse(functionCode, 'js').program.body[0]);
    const condition = path.get('body', 'body', 0, 'test', 'left');
    const withGuardClause = guardClauseService.moveToGuardClause(
      path,
      condition,
      GuardClausePosition.append,
      GuardClauseType.break
    );

    let _guardClause: IfStatementKind | null = null;
    visit(withGuardClause.node, { visitIfStatement: (path) => (_guardClause = path.node) });

    const guardClause = _guardClause as unknown as IfStatementKind | null;

    expect(guardClause?.consequent.type).to.equal('BreakStatement');
  });

  test('replaces empty loops with true', () => {
    const path = new NodePath(astService.parse(whileLoopCode, 'js').program.body[0]);
    const condition = path.get('test');
    const withGuardClause = guardClauseService.moveToGuardClause(path, condition);

    expect(astService.stripAttributes(withGuardClause.node.test)).to.deep.equal({
      type: 'Literal',
      value: true,
      comments: null,
      regex: null,
    });
  });

  test('removes condition from original expression', () => {
    const node = new NodePath(astService.parse(functionCode, 'js').program.body[0]);
    const condition = node.get('body', 'body', 0, 'test', 'left');
    const withGuardClause = guardClauseService.moveToGuardClause(node, condition, GuardClausePosition.append);

    expect(
      astService.stripAttributes(withGuardClause.node.body.body[0].test, ['original', 'loc', 'tokens', 'right'])
    ).to.deep.equal({ type: 'Identifier', name: 'b' });
  });

  test('removes empty if conditions', () => {
    const node = new NodePath(astService.parse(functionCode, 'js').program.body[0]);
    const condition = node.get('body', 'body', 0, 'test');
    const withGuardClause = guardClauseService.moveToGuardClause(node, condition);

    expect(withGuardClause.node.body.body.length).to.equal(1);
  });

  test('keeps else if if is removed', () => {
    const node = new NodePath(astService.parse(functionIfElseCode, 'js').program.body[0]);
    const condition = node.get('body', 'body', 0, 'test');
    const withGuardClause = guardClauseService.moveToGuardClause(node, condition);

    expect(withGuardClause.node.body.body.length).to.equal(3);
  });

  test('keeps else if if is removed (no block)', () => {
    const node = new NodePath(astService.parse(functionIfElseSimpleCode, 'js').program.body[0]);
    const condition = node.get('body', 'body', 0, 'test');
    const withGuardClause = guardClauseService.moveToGuardClause(node, condition);

    expect(withGuardClause.node.body.body.length).to.equal(3);
  });

  test('keeps else if if is removed', () => {
    const node = new NodePath(astService.parse(functionMultiConditionCode, 'js').program.body[0]);
    const condition = node.get('body', 'body', 0, 'test', 'right');
    const withGuardClause = guardClauseService.moveToGuardClause(node, condition);

    expect(withGuardClause.node.body.body.length).to.equal(2);
  });
});
