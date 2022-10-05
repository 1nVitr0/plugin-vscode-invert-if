[vscode-invert-if](../README.md) / [Exports](../modules.md) / BinaryExpressionUpdatedNode

# Interface: BinaryExpressionUpdatedNode<T\>

Syntax node representing a binary expression.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`BinaryExpressionSyntaxNode`](BinaryExpressionSyntaxNode.md)<`T`, [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>\>

- [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

  ↳ **`BinaryExpressionUpdatedNode`**

## Table of contents

### Properties

- [changed](BinaryExpressionUpdatedNode.md#changed)
- [created](BinaryExpressionUpdatedNode.md#created)
- [description](BinaryExpressionUpdatedNode.md#description)
- [left](BinaryExpressionUpdatedNode.md#left)
- [name](BinaryExpressionUpdatedNode.md#name)
- [operator](BinaryExpressionUpdatedNode.md#operator)
- [range](BinaryExpressionUpdatedNode.md#range)
- [ref](BinaryExpressionUpdatedNode.md#ref)
- [removed](BinaryExpressionUpdatedNode.md#removed)
- [right](BinaryExpressionUpdatedNode.md#right)
- [type](BinaryExpressionUpdatedNode.md#type)

## Properties

### changed

• `Optional` **changed**: ``true``

Wether the syntax node has been updated.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[changed](UpdatedSyntaxNode.md#changed)

#### Defined in

[nodes/SyntaxNode.ts:67](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L67)

___

### created

• `Optional` **created**: ``true``

Wether the syntax node has been added.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[created](UpdatedSyntaxNode.md#created)

#### Defined in

[nodes/SyntaxNode.ts:75](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L75)

___

### description

• `Optional` **description**: `string`

Additional description for the syntax node.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[description](UpdatedSyntaxNode.md#description)

#### Defined in

[nodes/SyntaxNode.ts:51](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L51)

___

### left

• **left**: [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

The left argument of the binary expression.

#### Inherited from

[BinaryExpressionSyntaxNode](BinaryExpressionSyntaxNode.md).[left](BinaryExpressionSyntaxNode.md#left)

#### Defined in

[nodes/ConditionNode.ts:72](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L72)

___

### name

• `Optional` **name**: `string`

A descriptive name for the syntax node.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[name](UpdatedSyntaxNode.md#name)

#### Defined in

[nodes/SyntaxNode.ts:35](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L35)

___

### operator

• **operator**: [`BinaryOperator`](../enums/BinaryOperator.md)

The operator of the binary expression.

#### Inherited from

[BinaryExpressionSyntaxNode](BinaryExpressionSyntaxNode.md).[operator](BinaryExpressionSyntaxNode.md#operator)

#### Defined in

[nodes/ConditionNode.ts:68](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L68)

___

### range

• `Optional` **range**: `Range`

The range of the code represented by the syntax node.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[range](UpdatedSyntaxNode.md#range)

#### Defined in

[nodes/SyntaxNode.ts:47](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L47)

___

### ref

• `Optional` **ref**: `T`

The original syntax node.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[ref](UpdatedSyntaxNode.md#ref)

#### Defined in

[nodes/SyntaxNode.ts:55](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L55)

___

### removed

• `Optional` **removed**: ``true``

Wether the syntax node has been removed.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[removed](UpdatedSyntaxNode.md#removed)

#### Defined in

[nodes/SyntaxNode.ts:71](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L71)

___

### right

• **right**: [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

The right argument of the binary expression.

#### Inherited from

[BinaryExpressionSyntaxNode](BinaryExpressionSyntaxNode.md).[right](BinaryExpressionSyntaxNode.md#right)

#### Defined in

[nodes/ConditionNode.ts:76](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L76)

___

### type

• **type**: [`BinaryExpression`](../enums/SyntaxNodeType.md#binaryexpression)

The type of the syntax node.

#### Overrides

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[type](UpdatedSyntaxNode.md#type)

#### Defined in

[nodes/ConditionNode.ts:86](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L86)
