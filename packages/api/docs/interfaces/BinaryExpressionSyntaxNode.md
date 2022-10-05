[vscode-invert-if](../README.md) / [Exports](../modules.md) / BinaryExpressionSyntaxNode

# Interface: BinaryExpressionSyntaxNode<T, S\>

Syntax node representing a binary expression.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | extends [`SyntaxNode`](SyntaxNode.md)<`T`\> = [`SyntaxNode`](SyntaxNode.md)<`T`\> |

## Hierarchy

- [`SyntaxNode`](SyntaxNode.md)<`T`\>

  ↳ **`BinaryExpressionSyntaxNode`**

  ↳↳ [`BinaryExpressionRefNode`](BinaryExpressionRefNode.md)

  ↳↳ [`BinaryExpressionUpdatedNode`](BinaryExpressionUpdatedNode.md)

## Table of contents

### Properties

- [left](BinaryExpressionSyntaxNode.md#left)
- [name](BinaryExpressionSyntaxNode.md#name)
- [operator](BinaryExpressionSyntaxNode.md#operator)
- [right](BinaryExpressionSyntaxNode.md#right)
- [type](BinaryExpressionSyntaxNode.md#type)

## Properties

### left

• **left**: `S`

The left argument of the binary expression.

#### Defined in

[nodes/ConditionNode.ts:72](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L72)

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

• **operator**: [`BinaryOperator`](../enums/BinaryOperator.md)

The operator of the binary expression.

#### Defined in

[nodes/ConditionNode.ts:68](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L68)

___

### right

• **right**: `S`

The right argument of the binary expression.

#### Defined in

[nodes/ConditionNode.ts:76](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L76)

___

### type

• **type**: [`BinaryExpression`](../enums/SyntaxNodeType.md#binaryexpression)

The type of the syntax node.

#### Overrides

[SyntaxNode](SyntaxNode.md).[type](SyntaxNode.md#type)

#### Defined in

[nodes/ConditionNode.ts:64](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L64)
