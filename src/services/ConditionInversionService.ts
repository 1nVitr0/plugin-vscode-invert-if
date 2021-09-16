import { Node } from 'acorn';
import ConfigurationService from './ConfigurationService';

export type LogicOperator = '==' | '===' | '!=' | '!==' | '<' | '<=' | '>' | '>=' | '&&' | '||';
export type UnaryLogicOperator = '!';
export interface UnaryExpression extends Node {
  operator: UnaryLogicOperator;
  argument: Node;
}
export interface BinaryExpression extends Node {
  operator: LogicOperator;
  left: Node;
  right: Node;
}

export function isUnaryExpression(node: Node): node is UnaryExpression {
  return node.type == 'UnaryExpression';
}

export function isBinaryExpression(node: Node): node is BinaryExpression {
  return node.type == 'BinaryExpression' || node.type == 'LogicalExpression';
}

export default class ConditionInversionService {
  public static inverseOperator: { [k in LogicOperator]: LogicOperator } = {
    '==': '!=',
    '===': '!==',
    '!=': '==',
    '!==': '===',
    '&&': '||',
    '||': '&&',
    '<': '>=',
    '<=': '>',
    '>': '<=',
    '>=': '<',
  };
  public static inverseUnaryOperator: { [k in UnaryLogicOperator]: UnaryLogicOperator | null } = { '!': null };

  public constructor(private configurationService: ConfigurationService) {}

  public extractConditions(node: Node): Node[] {
    // TODO: implement - stub for testing:
    return [(<any>node).body[0].test as Node];
  }

  public inverse(
    condition: Node,
    depth = this.configurationService.inversionDepth
  ): Node | UnaryExpression | BinaryExpression {
    if (isUnaryExpression(condition) || depth == 0) {
      return this.inverseGroup(condition);
    } else if (isBinaryExpression(condition)) {
      const isLogic = condition.type == 'LogicalExpression';
      const inverse = ConditionInversionService.inverseOperator[condition.operator];
      if (!inverse) return this.inverseGroup(condition);
      return {
        ...condition,
        operator: inverse,
        left: isLogic ? this.inverse(condition.left, depth - 1) : condition.left,
        right: isLogic ? this.inverse(condition.right, depth - 1) : condition.right,
      };
    } else {
      return condition;
    }
  }

  public inverseGroup(condition: UnaryExpression | Node): Node | UnaryExpression | BinaryExpression {
    if (!isUnaryExpression(condition)) {
      return {
        type: 'UnaryExpression',
        operator: '!',
        prefix: true,
        start: condition.start,
        end: condition.end,
        argument: condition,
      } as Node;
    }

    const inverse = ConditionInversionService.inverseUnaryOperator[condition.operator];
    if (inverse) return { ...condition, operator: inverse };
    else return condition.argument;
  }
}
