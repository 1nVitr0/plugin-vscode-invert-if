import { Node } from 'acorn';

export type GuardClauseType = 'break' | 'continue' | 'return' | 'auto';

export default class IfElseInversionService {
  public constructor() {}

  public extractIfBlocks(node: Node): Node[] {
    throw new Error('not implemented');
  }

  public extractIfElseBlocks(node: Node): Node[] {
    throw new Error('not implemented');
  }

  public inverse(block: Node): Node {
    throw new Error('not implemented');
  }

  public toGuardClause(block: Node, type: GuardClauseType = 'auto'): Node {
    throw new Error('not implemented');
  }

  public detectGuardClauseType(block: Node, outer: Node): GuardClauseType {
    throw new Error('not implemented');
  }
}
