import { expect } from 'chai';
import InvertIfServiceProvider from '../../../providers/InvertIfServiceProvider';
import ASTService from '../../../services/ASTService';
import ConditionService from '../../../services/ConditionService';
import ValidationService from '../../../services/ValidationService';
import ConfigurationService from '../../../services/ConfigurationService';
import GuardClauseService from '../../../services/GuardClauseService';
import IfElseService from '../../../services/IfElseService';
import LanguageService from '../../../services/LanguageService';

suite('Unit tests for ASTService', () => {
  let serviceProvider: InvertIfServiceProvider;

  suiteSetup(() => {
    serviceProvider = new InvertIfServiceProvider();
  });

  test("provides all services", () => {
    expect(serviceProvider.condition).to.be.instanceOf(ConditionService);
    expect(serviceProvider.config).to.be.instanceOf(ConfigurationService);
    expect(serviceProvider.guardClause).to.be.instanceOf(GuardClauseService);
    expect(serviceProvider.ifElse).to.be.instanceOf(IfElseService);
    expect(serviceProvider.lang).to.be.instanceOf(LanguageService);
    expect(serviceProvider.validation).to.be.instanceOf(ValidationService);
  });
});
