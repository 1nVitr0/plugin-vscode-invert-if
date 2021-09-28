import ConfigurationService from '../services/ConfigurationService';
import ASTService from '../services/ASTService';
import ConditionService from '../services/ConditionService';
import IfElseService from '../services/IfElseService';
import ValidationService from '../services/ValidationService';
import GuardClauseService from '../services/GuardClauseService';
import LanguageService from '../services/LanguageService';

export default class InvertIfServiceProvider {
  public configuration: ConfigurationService;
  public lang: LanguageService;
  public ast: ASTService;
  public condition: ConditionService;
  public ifElse: IfElseService;
  public guardClause: GuardClauseService;
  public validation: ValidationService;

  public constructor() {
    this.configuration = new ConfigurationService();
    this.lang = new LanguageService(this.configuration);
    this.ast = new ASTService(this.configuration);
    this.condition = new ConditionService(this.configuration);
    this.ifElse = new IfElseService(this.configuration, this.condition);
    this.guardClause = new GuardClauseService(this.configuration, this.ast, this.condition);
    this.validation = new ValidationService(this.configuration);
  }
}
