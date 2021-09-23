import { ProgramKind } from 'ast-types/gen/kinds';
import { expect } from 'chai';
import ASTService from '../../../services/ASTService';
import ConfigurationService from '../../../services/ConfigurationService';
import InvertIfServiceProvider from '../../../providers/InvertIfServiceProvider';
import ConditionInversionService from '../../../services/ConditionInversionService';
import GuardClauseService from '../../../services/GuardClauseService';
import IfElseInversionService from '../../../services/IfElseInversionService';
import ConditionValidationService from '../../../services/ConditionValidationService';

suite('Unit tests for ASTService', () => {
  let serviceProvider: InvertIfServiceProvider;

  suiteSetup(() => {
    serviceProvider = new InvertIfServiceProvider();
  });

  test('provides all services', () => {
    expect(serviceProvider.ast).to.be.instanceOf(ASTService);
    expect(serviceProvider.conditionInversion).to.be.instanceOf(ConditionInversionService);
    expect(serviceProvider.configuration).to.be.instanceOf(ConfigurationService);
    expect(serviceProvider.guardClause).to.be.instanceOf(GuardClauseService);
    expect(serviceProvider.ifElseInversion).to.be.instanceOf(IfElseInversionService);
    expect(serviceProvider.validation).to.be.instanceOf(ConditionValidationService);
  });
});
