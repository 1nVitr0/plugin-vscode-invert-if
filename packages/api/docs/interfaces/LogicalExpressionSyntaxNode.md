[vscode-invert-if](../README.md) / [Exports](../modules.md) / LogicalExpressionSyntaxNode

# Interface: LogicalExpressionSyntaxNode<T, S\>

Syntax node representing a logical expression.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | extends [`SyntaxNode`](SyntaxNode.md)<`T`\> = [`SyntaxNode`](SyntaxNode.md)<`T`\> |

## Hierarchy

- [`SyntaxNode`](SyntaxNode.md)<`T`\>

  ↳ **`LogicalExpressionSyntaxNode`**

  ↳↳ [`LogicalExpressionRefNode`](LogicalExpressionRefNode.md)

  ↳↳ [`LogicalExpressionUpdatedNode`](LogicalExpressionUpdatedNode.md)

## Table of contents

### Properties

- [left](LogicalExpressionSyntaxNode.md#left)
- [name](LogicalExpressionSyntaxNode.md#name)
- [operator](LogicalExpressionSyntaxNode.md#operator)
- [right](LogicalExpressionSyntaxNode.md#right)
- [type](LogicalExpressionSyntaxNode.md#type)

## Properties

### left

• **left**: `S`

The left argument of the logical expression.

#### Defined in

[nodes/ConditionNode.ts:101](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L101)

___

### name

• `Optional` **name**: `string`

A descriptive name for the syntax node.

#### Inherited from

[SyntaxNode](SyntaxNode.md).[name](SyntaxNode.md#name)

#### Defined in

[nodes/SyntaxNode.ts:35](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L35)

___

### operator

• **operator**: [`LogicalOperator`](../enums/LogicalOperator.md)

The operator of the logical expression.

#### Defined in

[nodes/ConditionNode.ts:97](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L97)

___

### right

• **right**: `S`

The right argument of the logical expression.

#### Defined in

[nodes/ConditionNode.ts:105](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L105)

___

### type

• **type**: [`LogicalExpression`](../enums/SyntaxNodeType.md#logicalexpression)

The type of the syntax node.

#### Overrides

[SyntaxNode](SyntaxNode.md).[type](SyntaxNode.md#type)

#### Defined in

[nodes/ConditionNode.ts:93](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L93)
