import { Parser } from 'acorn';

export default class ConditionTreeProvider {
  public parse(code: string) {
    const root = Parser.parse(code, { ecmaVersion: 2016 });
    console.log(root);
    //JSON.stringify(root, null, 2);
  }
}
