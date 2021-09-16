import { Options } from 'acorn';
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
      default: { useEcmaVersion: 'latest' },
      js: { useEcmaVersion: 'latest' },
      ts: { useEcmaVersion: 'latest' },
    },
  };

  public configurationTarget: ConfigurationTarget = ConfigurationTarget.Global;

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
