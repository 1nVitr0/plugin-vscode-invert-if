import { expect } from 'chai';
import InvertIfServiceProvider from '../../../providers/InvertIfServiceProvider';
import ASTService from '../../../services/ASTService';
import ConditionInversionService from '../../../services/ConditionInversionService';
import ConditionValidationService from '../../../services/ConditionValidationService';
import ConfigurationService from '../../../services/ConfigurationService';
import GuardClauseService from '../../../services/GuardClauseService';
import IfElseInversionService from '../../../services/IfElseInversionService';

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
