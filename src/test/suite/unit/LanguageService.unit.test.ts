import { expect } from 'chai';
import ConfigurationService from '../../../services/ConfigurationService';
import LanguageService from '../../../services/LanguageService';

suite('Unit tests for ASTService', () => {
  let configurationService: ConfigurationService;
  let languageService: LanguageService;

  suiteSetup(() => {
    configurationService = new ConfigurationService();
    languageService = new LanguageService(configurationService);
  });

  test('provides error messages with parameter', () => {
    const errorMessage = languageService.errorMessage('genericError', 'parameter');
    expect(errorMessage.indexOf('parameter')).to.be.at.least(0);
  });

  test('provides info messages with parameter', () => {
    const errorMessage = languageService.infoMessage('noChanges', 'parameter');
    expect(errorMessage.indexOf('parameter')).to.be.at.least(0);
  });
});
