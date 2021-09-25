import ConfigurationService from './ConfigurationService';

export type ErrorMessageList = Record<
  'conditionNotFound' | 'parseError' | 'invalidParentStatement' | 'noIfBlock' | 'genericError',
  string
>;
export type InfoMessageList = Record<'noChanges', string>;

export default class LanguageService {
  private errorMessages: ErrorMessageList = {
    conditionNotFound: 'No condition found in selection',
    noIfBlock: 'If Block not found',
    invalidParentStatement: 'No valid parent Statement found',
    parseError: 'Document could not be parsed',
    genericError: 'An error occurred',
  };
  private infoMessages: InfoMessageList = {
    noChanges: 'Successful, but no changes generated',
  };

  public constructor(private configurationService: ConfigurationService) {}

  public errorMessage(id: keyof ErrorMessageList, ...params: any[]): string {
    return params ? `${this.errorMessages[id]}: ${params.join(', ')}` : this.errorMessages[id];
  }

  public infoMessage(id: keyof InfoMessageList, ...params: any[]): string {
    return params ? `${this.infoMessages[id]}: ${params.join(', ')}` : this.infoMessages[id];
  }
}
