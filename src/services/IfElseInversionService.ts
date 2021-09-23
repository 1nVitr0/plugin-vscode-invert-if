import { IfStatementKind } from 'ast-types/gen/kinds';
import { types, visit } from 'recast';
import ConditionInversionService from './ConditionInversionService';
import ConfigurationService from './ConfigurationService';

export default class IfElseInversionService {
  public constructor(
    protected configurationService: ConfigurationService,
    protected conditionInversionService: ConditionInversionService
  ) {}

  public extractIfBlocks(node: types.ASTNode, max = Infinity): IfStatementKind[] {
    const statements: IfStatementKind[] = [];

    visit(node, {
      visitIfStatement(path) {
        statements.push(path.node);
        if (statements.length < max) this.traverse(path);
      },
    });

    return statements;
  }

  public inverse({ test, alternate, consequent }: IfStatementKind): IfStatementKind {
    const inverseCondition = this.conditionInversionService.inverse(test);
    return types.builders.ifStatement(inverseCondition, alternate || types.builders.blockStatement([]), consequent);
  }
}
