import EsprimaASTTransformer from '../../../ast/EsprimaASTTransformer';
import { service } from '../../../injections';

suite('Test ASTTransformer', () => {
  let transformer: EsprimaASTTransformer;

  suiteSetup(() => {
    transformer = new EsprimaASTTransformer();
  });

  test.only('Stuff', () => {
    const code = 'if (a) { console.log(b); }';
    const ast = service.ast.parse(code, 'js');
    const transformed = transformer.transform(ast);
    const reversed = transformer.revert(transformed);
    console.log(reversed);
  });
});
