import { Options } from 'acorn';
import { NodeKind } from 'ast-types/gen/kinds';
import { ConfigurationTarget, workspace, WorkspaceConfiguration } from 'vscode';

export interface LanguageOptions {
  useEcmaVersion: Options['ecmaVersion'];
}

export interface Configuration {
  formatAfterInversion: boolean;
  enableContextMenu: boolean;
  inversionDepth: number;
  languageOptions: Record<string, LanguageOptions> & { default: LanguageOptions };
}

export default class ConfigurationService implements Configuration {
  public static defaultConfiguration: Configuration = {
    formatAfterInversion: false,
    enableContextMenu: true,
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

  public reset(path?: Path<Configuration>) {
    throw new Error('not implemented');
  }

  public get formatAfterInversion(): boolean {
    return this.get('formatAfterInversion');
  }

  public set formatAfterInversion(value: boolean) {
    this.update('formatAfterInversion', value);
  }

  public get enableContextMenu(): boolean {
    return this.get('enableContextMenu');
  }

  public set enableContextMenu(value: boolean) {
    this.update('enableContextMenu', value);
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

  public updateLanguageOptions(language: string, value: LanguageOptions) {
    const previous = this.configuration.get<LanguageOptions>(`languageOptions.${language}`) || {};
    this.update(['languageOptions', language], { ...previous, value });
  }

  public replaceLanguageOptions(language: string, value: LanguageOptions) {
    this.update(['languageOptions', language], value);
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
