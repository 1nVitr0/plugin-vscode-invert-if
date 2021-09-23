import ConfigurationService from './ConfigurationService';
import ConditionInversionService from './ConditionInversionService';
import { types } from 'recast';
import { BreakStatementKind, ContinueStatementKind, ReturnStatementKind, StatementKind } from 'ast-types/gen/kinds';
import { ConditionalExpression } from './ConditionInversionService';

export type GuardClauseType = 'break' | 'continue' | 'return' | 'auto';

export default class GuardClauseService {
  public constructor(
    protected configurationService: ConfigurationService,
    protected conditionInversionService: ConditionInversionService
  ) {}

  public toGuardClause(
    block: StatementKind,
    condition: ConditionalExpression,
    type: GuardClauseType = 'auto'
  ): StatementKind {
    const detectedGuardType: Exclude<GuardClauseType, 'auto'> =
      type == 'auto' ? this.detectGuardClauseType(block) : type;

    const statement = this.getGuardStatement(detectedGuardType);
    return types.builders.ifStatement(condition, statement);
  }

  public detectGuardClauseType(block: StatementKind): Exclude<GuardClauseType, 'auto'> {
    switch (block.type) {
      case 'WhileStatement':
      case 'ForStatement':
      case 'ForInStatement':
      case 'ForOfStatement':
      case 'ForAwaitStatement':
      case 'DoWhileStatement':
        return 'break';
      case 'FunctionDeclaration':
        return 'return';
      default:
        return 'return';
    }
  }

  private getGuardStatement(
    type: Exclude<GuardClauseType, 'auto'>
  ): BreakStatementKind | ReturnStatementKind | ContinueStatementKind {
    switch (type) {
      case 'break':
        return types.builders.breakStatement();
      case 'continue':
        return types.builders.continueStatement();
      case 'return':
        return types.builders.returnStatement(null);
    }
  }
}
