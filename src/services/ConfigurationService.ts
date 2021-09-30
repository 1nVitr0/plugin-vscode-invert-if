import { Options } from 'acorn';
import { NodeKind } from 'ast-types/gen/kinds';
import { ConfigurationTarget, workspace, WorkspaceConfiguration } from 'vscode';

export interface LanguageOptions {
  useEcmaVersion: Options['ecmaVersion'];
}

export interface Configuration {
  inversionDepth: number;
  languageOptions: Record<string, LanguageOptions> & { default: LanguageOptions };
}

export default class ConfigurationService implements Configuration {
  public static defaultConfiguration: Configuration = {
    inversionDepth: Infinity,
    languageOptions: {
      default: { useEcmaVersion: 2020 },
      js: { useEcmaVersion: 2020 },
      ts: { useEcmaVersion: 2020 },
    },
  };

  public configurationTarget: ConfigurationTarget = ConfigurationTarget.Global;

  // TODO: make configuration
  public get guardClauseParentTypes(): NodeKind['type'][] {
    return [
      'WhileStatement',
      'ForStatement',
      'ForAwaitStatement',
      'ForInStatement',
      'ForOfStatement',
      'DoWhileStatement',
      'FunctionExpression',
      'FunctionDeclaration',
      'ArrowFunctionExpression',
    ];
  }

  public get inversionDepth(): number {
    return this.get('inversionDepth');
  }

  public set inversionDepth(value: number) {
    this.update('inversionDepth', value);
  }

  public get languageOptions(): Record<string, LanguageOptions> & { default: LanguageOptions } {
    return this.get('languageOptions');
  }

  private get configuration(): WorkspaceConfiguration {
    return workspace.getConfiguration('invertIf');
  }

  private get<K extends keyof Configuration>(key: K): Configuration[K] {
    const result = this.configuration.get<Configuration[K]>(key);
    return result !== undefined ? result : ConfigurationService.defaultConfiguration[key];
  }

  private update<K extends keyof Configuration | Path<Configuration>>(
    key: K,
    value: K extends keyof Configuration ? Configuration[K] : any
  ) {
    this.configuration.update(typeof key === 'string' ? key : key.join('.'), value, this.configurationTarget);
  }
}
