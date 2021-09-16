import { expect } from 'chai';
import ASTService from '../../../services/ASTService';
import ConfigurationService from '../../../services/ConfigurationService';
import ConditionInversionService from '../../../services/ConditionInversionService';

suite('Unit tests for ASTService', () => {
  let configurationService: ConfigurationService;
  let astService: ASTService;
  let inversionService: ConditionInversionService;

  suiteSetup(() => {
    configurationService = new ConfigurationService();
    astService = new ASTService(configurationService);
    inversionService = new ConditionInversionService(configurationService);
  });

  test('parses valid js Code', () => {
    const node = astService.parse('if (a == b && c <= d && (e & f || f2) || !g || !(h * i)) {}', 'js');
    const conditions = inversionService.extractConditions(node);
    const inverse = inversionService.inverse(conditions[0]);
    const code = astService.stringify(inverse, 'js');
    expect(node).to.deep.equal({});
  });
});
