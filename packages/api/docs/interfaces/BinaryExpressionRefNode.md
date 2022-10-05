[vscode-invert-if](../README.md) / [Exports](../modules.md) / BinaryExpressionRefNode

# Interface: BinaryExpressionRefNode<T\>

Syntax node representing a binary expression.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`BinaryExpressionSyntaxNode`](BinaryExpressionSyntaxNode.md)<`T`, [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>\>

- [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

  ↳ **`BinaryExpressionRefNode`**

## Table of contents

### Properties

- [description](BinaryExpressionRefNode.md#description)
- [left](BinaryExpressionRefNode.md#left)
- [name](BinaryExpressionRefNode.md#name)
- [operator](BinaryExpressionRefNode.md#operator)
- [range](BinaryExpressionRefNode.md#range)
- [ref](BinaryExpressionRefNode.md#ref)
- [right](BinaryExpressionRefNode.md#right)
- [type](BinaryExpressionRefNode.md#type)

## Properties

### description

• `Optional` **description**: `string`

Additional description for the syntax node.

#### Inherited from

[RefSyntaxNode](RefSyntaxNode.md).[description](RefSyntaxNode.md#description)

#### Defined in

[nodes/SyntaxNode.ts:51](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L51)

___

### left

• **left**: [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

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

[RefSyntaxNode](RefSyntaxNode.md).[name](RefSyntaxNode.md#name)

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

• **range**: `Range`

The range of the code represented by the syntax node.

#### Inherited from

[RefSyntaxNode](RefSyntaxNode.md).[range](RefSyntaxNode.md#range)

#### Defined in

[nodes/SyntaxNode.ts:47](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L47)

___

### ref

• **ref**: `T`

The original syntax node.

#### Inherited from

[RefSyntaxNode](RefSyntaxNode.md).[ref](RefSyntaxNode.md#ref)

#### Defined in

[nodes/SyntaxNode.ts:55](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L55)

___

### right

• **right**: [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

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

[RefSyntaxNode](RefSyntaxNode.md).[type](RefSyntaxNode.md#type)

#### Defined in

[nodes/ConditionNode.ts:80](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L80)
