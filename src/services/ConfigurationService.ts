import { ConfigurationTarget, workspace, WorkspaceConfiguration } from 'vscode';

export interface Configuration {
  formatAfterInversion: boolean;
  enableContextMenu: boolean;
}

export default class ConfigurationService implements Configuration {
  public static defaultConfiguration: Configuration = {
    formatAfterInversion: false,
    enableContextMenu: true,
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
