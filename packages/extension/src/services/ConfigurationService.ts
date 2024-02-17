import { NodeKind } from "ast-types/lib/gen/kinds";
import { ConfigurationTarget, workspace, WorkspaceConfiguration } from "vscode";

export interface LanguageOptions {}

export interface Configuration {
  inversionDepth: number;
  languageOptions: Record<string, LanguageOptions> & { default: LanguageOptions };
  truthTableBooleanText: { true: string; false: string };
  truthTableConditionIndex: `${string}${"#1" | "#a" | "#I"}${string}`;
}

export default class ConfigurationService implements Configuration {
  public static defaultConfiguration: Configuration = {
    inversionDepth: Infinity,
    languageOptions: {
      default: {},
      js: {},
      ts: {},
    },
    truthTableBooleanText: {
      true: "true",
      false: "false",
    },
    truthTableConditionIndex: "#1",
  };

  public configurationTarget: ConfigurationTarget = ConfigurationTarget.Global;

  // TODO: make configuration
  public get guardClauseParentTypes(): NodeKind["type"][] {
    return [
      "WhileStatement",
      "ForStatement",
      "ForAwaitStatement",
      "ForInStatement",
      "ForOfStatement",
      "DoWhileStatement",
      "FunctionExpression",
      "FunctionDeclaration",
      "ArrowFunctionExpression",
    ];
  }

  public get inversionDepth(): number {
    return this.get("inversionDepth");
  }

  public set inversionDepth(value: number) {
    this.update("inversionDepth", value);
  }

  public get truthTableBooleanText() {
    return this.get("truthTableBooleanText");
  }

  public set truthTableBooleanText(value: { true: string; false: string }) {
    this.update("truthTableBooleanText", value);
  }

  public get truthTableConditionIndex() {
    return this.get("truthTableConditionIndex");
  }

  public set truthTableConditionIndex(value: `${string}${"#1" | "#a" | "#I"}${string}`) {
    this.update("truthTableConditionIndex", value);
  }

  public get languageOptions(): Record<string, LanguageOptions> & { default: LanguageOptions } {
    return this.get("languageOptions");
  }

  private get configuration(): WorkspaceConfiguration {
    return workspace.getConfiguration("invertIf");
  }

  private get<K extends keyof Configuration>(key: K): Configuration[K] {
    const result = this.configuration.get<Configuration[K]>(key);
    return result !== undefined ? result : ConfigurationService.defaultConfiguration[key];
  }

  private update<K extends keyof Configuration | Path<Configuration>>(
    key: K,
    value: K extends keyof Configuration ? Configuration[K] : any
  ) {
    this.configuration.update(typeof key === "string" ? key : key.join("."), value, this.configurationTarget);
  }
}
