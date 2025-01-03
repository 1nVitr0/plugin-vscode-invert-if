import { Disposable } from "vscode";
import ConditionService from "../services/ConditionService";
import ConfigurationService from "../services/ConfigurationService";
import GuardClauseService from "../services/GuardClauseService";
import IfElseService from "../services/IfElseService";
import LanguageService from "../services/LanguageService";
import PluginService from "../services/PluginService";
import ValidationService from "../services/ValidationService";
import EmbeddedLanguageService from "../services/EmbeddedLanguageService";

export default class InvertIfServiceProvider implements Disposable {
  public readonly config: ConfigurationService;
  public readonly lang: LanguageService;
  public readonly condition: ConditionService;
  public readonly ifElse: IfElseService;
  public readonly guardClause: GuardClauseService;
  public readonly validation: ValidationService;
  public readonly embedded: EmbeddedLanguageService;
  public readonly plugins: PluginService;

  public constructor() {
    this.config = new ConfigurationService();
    this.lang = new LanguageService(this.config);
    this.condition = new ConditionService(this.config);
    this.ifElse = new IfElseService(this.config, this.condition);
    this.guardClause = new GuardClauseService(this.config, this.condition);
    this.validation = new ValidationService(this.config, this.condition);
    this.embedded = new EmbeddedLanguageService(this.config);
    this.plugins = new PluginService(this.config);
  }

  public dispose() {
    this.plugins.dispose();
  }
}
