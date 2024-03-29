import { IfStatementKind } from 'ast-types/gen/kinds';
import { expect } from 'chai';
import ASTService from '../../../services/ASTService';
import ConditionService from '../../../services/ConditionService';
import ConfigurationService from '../../../services/ConfigurationService';

suite('Unit tests for ConditionService', () => {
  let configurationService: ConfigurationService;
  let astService: ASTService;
  let conditionService: ConditionService;

  suiteSetup(() => {
    configurationService = new ConfigurationService();
    astService = new ASTService(configurationService);
    conditionService = new ConditionService(configurationService);
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

  test("inverses conditions", () => {
    const node = astService.parse("if (a == b) {}", "js");
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const inverse = conditionService.getInverseCondition(statement.test);

    expect(astService.stringify(inverse, "js")).to.equal("a != b");
  });

  test("inverses groups", () => {
    const node = astService.parse("if (a == b && c == d && e == f) {}", "js");
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const inverse = conditionService.getInverseGroup(statement.test);

    expect(astService.stringify(inverse, "js")).to.equal("!(a == b && c == d && e == f)");
  });

  test("inverse respects depth", () => {
    const node = astService.parse("if (a == b && c == d && e == f) {}", "js");
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const inverse = conditionService.getInverseCondition(statement.test, 1);

    expect(astService.stringify(inverse, "js")).to.equal("!(a == b && c == d) || !(e == f)");
  });

  test("inverses binary expression as group", () => {
    const node = astService.parse("if (a +b) {}", "js");
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const inverse = conditionService.getInverseCondition(statement.test, 1);

    expect(astService.stringify(inverse, "js")).to.equal("!(a + b)");
  });

  test("inverses unary expression", () => {
    const node = astService.parse("if (+a) {}", "js");
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const inverse = conditionService.getInverseCondition(statement.test, 1);

    expect(astService.stringify(inverse, "js")).to.equal("!+a");
  });

  test("removes unary ! expression", () => {
    const node = astService.parse("if (!a) {}", "js");
    const statement: IfStatementKind = node.program.body[0] as IfStatementKind;
    const inverse = conditionService.getInverseCondition(statement.test, 1);

    expect(astService.stringify(inverse, "js")).to.equal("a");
  });
});
