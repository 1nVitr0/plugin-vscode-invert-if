import ConfigurationService from '../../../services/ConfigurationService';
import { expect } from 'chai';

suite('Unit tests for ConfigurationService', () => {
  let configurationService: ConfigurationService;

  suiteSetup(() => {
    configurationService = new ConfigurationService();
  });

  test('exports all properties', () => {
    expect(configurationService.inversionDepth).to.not.be.undefined;
    expect(configurationService.configurationTarget).to.not.be.undefined;
    expect(configurationService.guardClauseParentTypes).to.not.be.undefined;
  });

  test('updating properties without error', () => {
    configurationService.inversionDepth = configurationService.inversionDepth;
  });
});
