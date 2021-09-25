import ConfigurationService from '../services/ConfigurationService';
import ASTService from '../services/ASTService';
import ConditionInversionService from '../services/ConditionInversionService';
import IfElseInversionService from '../services/IfElseInversionService';
import ConditionValidationService from '../services/ConditionValidationService';
import GuardClauseService from '../services/GuardClauseService';
import LanguageService from '../services/LanguageService';

export default class InvertIfServiceProvider {
  public configuration: ConfigurationService;
  public lang: LanguageService;
  public ast: ASTService;
  public conditionInversion: ConditionInversionService;
  public ifElseInversion: IfElseInversionService;
  public guardClause: GuardClauseService;
  public validation: ConditionValidationService;

  public constructor() {
    this.configuration = new ConfigurationService();
    this.lang = new LanguageService(this.configuration);
    this.ast = new ASTService(this.configuration);
    this.conditionInversion = new ConditionInversionService(this.configuration);
    this.ifElseInversion = new IfElseInversionService(this.configuration, this.conditionInversion);
    this.guardClause = new GuardClauseService(this.configuration, this.ast, this.conditionInversion);
    this.validation = new ConditionValidationService(this.configuration);
  }
}
