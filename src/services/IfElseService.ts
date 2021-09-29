import { IfStatementKind, ExpressionKind, StatementKind } from 'ast-types/gen/kinds';
import { types } from 'recast';
import ConditionService from './ConditionService';
import ConfigurationService from './ConfigurationService';
import ASTService from './ASTService';

export default class IfElseService {
  public constructor(
    protected configurationService: ConfigurationService,
    protected astService: ASTService,
    protected conditionService: ConditionService
  ) {}

  public inverse({ test, alternate, consequent }: IfStatementKind): IfStatementKind {
    if (alternate && alternate.type == 'IfStatement') throw new Error('cannot invert if block with else-if statement');
    const inverseCondition = this.conditionService.inverse(test);
    return types.builders.ifStatement(inverseCondition, alternate || types.builders.blockStatement([]), consequent);
  }

  public combine(parent: IfStatementKind, ...statements: IfStatementKind[]): IfStatementKind {
    let current: IfStatementKind | null = parent;
    let consequent: StatementKind | null = null;
    const conditions: ExpressionKind[] = [];
    let alternate: StatementKind | null = null;

    while (current) {
      let alternateBlock: StatementKind | null = this.extendAlternates(current, conditions);

      consequent = current.consequent;
      conditions.push(current.test);
      if (alternate && alternateBlock && alternateBlock.type == 'IfStatement') alternateBlock.alternate = alternate;
      if (alternateBlock) alternate = alternateBlock;

      current =
        current.consequent.type == 'BlockStatement' && current.consequent.body[0]?.type == 'IfStatement'
          ? current.consequent.body[0]
          : current.consequent.type == 'IfStatement'
          ? current.consequent
          : null;
    }

    const result = consequent
      ? types.builders.ifStatement(this.astService.chainConditions('&&', ...conditions), consequent, alternate)
      : parent;
    result.loc = parent.loc;
    return result;
  }

  private extendAlternates(node: IfStatementKind, conditions: ExpressionKind[]): StatementKind | null {
    let result: StatementKind | null = null;

    let current = node.alternate;
    while (current) {
      const alternateCondition = current.type == 'IfStatement' ? [current.test] : [];
      const alternateBody = current.type == 'IfStatement' ? current.consequent : current;
      const alternate =
        conditions.length || alternateCondition.length
          ? types.builders.ifStatement(
              this.astService.chainConditions('&&', ...conditions, ...alternateCondition),
              alternateBody
            )
          : alternateBody;

      if (!result) result = alternate;
      else if (result.type == 'IfStatement') result.alternate = alternate;
      else throw new Error(`unexpected statement type: ${result.type}`);

      current = current.type == 'IfStatement' ? current.alternate : null;
    }

    return result;
  }
}
