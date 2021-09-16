import ASTService from '../services/ASTService';
import ConditionInversionService from '../services/ConditionInversionService';
import ConfigurationService from '../services/ConfigurationService';
import IfElseInversionService from '../services/IfElseInversionService';

export default class InvertIfServiceProvider {
  public ast: ASTService;
  public conditionInversion: ConditionInversionService;
  public configuration: ConfigurationService;
  public ifElseInversion: IfElseInversionService;

  public constructor() {
    this.ast = new ASTService();
    this.conditionInversion = new ConditionInversionService();
    this.configuration = new ConfigurationService();
    this.ifElseInversion = new IfElseInversionService();
  }
}
