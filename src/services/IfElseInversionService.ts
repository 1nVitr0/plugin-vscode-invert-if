import { IfStatementKind } from 'ast-types/gen/kinds';
import { types, visit } from 'recast';
import { Range } from 'vscode';
import ASTService from './ASTService';
import ConditionInversionService from './ConditionInversionService';
import ConfigurationService from './ConfigurationService';

export default class IfElseInversionService {
  public constructor(
    protected configurationService: ConfigurationService,
    protected conditionInversionService: ConditionInversionService
  ) {}

  public extractIfBlocks(node: types.ASTNode, range: Range | null = null, max = Infinity): IfStatementKind[] {
    const statements: IfStatementKind[] = [];

    visit(node, {
      visitIfStatement(path) {
        if (range && !ASTService.nodeIntersectsRange(path.node, range)) return this.traverse(path);
        statements.push(path.node);
        if (statements.length < max) this.traverse(path);
        else return false;
      },
    });

    return statements;
  }

  public inverse({ test, alternate, consequent }: IfStatementKind): IfStatementKind {
    const inverseCondition = this.conditionInversionService.inverse(test);
    return types.builders.ifStatement(inverseCondition, alternate || types.builders.blockStatement([]), consequent);
  }
}
