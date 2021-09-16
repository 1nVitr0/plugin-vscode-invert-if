import { Node } from 'acorn';

export default class ConditionInversionService {
  public extractConditions(node: Node): Node[] {
    throw new Error('not implemented');
  }

  public inverse(condition: Node): Node {
    throw new Error('not implemented');
  }
}
