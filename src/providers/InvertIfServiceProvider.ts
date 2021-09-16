import ConfigurationService from '../services/ConfigurationService';
import ASTService from '../services/ASTService';
import ConditionInversionService from '../services/ConditionInversionService';
import IfElseInversionService from '../services/IfElseInversionService';
import ConditionValidationService from '../services/ConditionValidationService';

export default class InvertIfServiceProvider {
  public configuration: ConfigurationService;
  public ast: ASTService;
  public conditionInversion: ConditionInversionService;
  public ifElseInversion: IfElseInversionService;
  public validation: ConditionValidationService;

  public constructor() {
    this.configuration = new ConfigurationService();
    this.ast = new ASTService(this.configuration);
    this.conditionInversion = new ConditionInversionService(this.configuration);
    this.ifElseInversion = new IfElseInversionService(this.configuration, this.conditionInversion);
    this.validation = new ConditionValidationService(this.configuration);
  }
}