[vscode-invert-if](../README.md) / [Exports](../modules.md) / LogicalExpressionRefNode

# Interface: LogicalExpressionRefNode<T\>

Syntax node representing a logical expression.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`LogicalExpressionSyntaxNode`](LogicalExpressionSyntaxNode.md)<`T`, [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>\>

- [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

  ↳ **`LogicalExpressionRefNode`**

## Table of contents

### Properties

- [description](LogicalExpressionRefNode.md#description)
- [left](LogicalExpressionRefNode.md#left)
- [name](LogicalExpressionRefNode.md#name)
- [operator](LogicalExpressionRefNode.md#operator)
- [range](LogicalExpressionRefNode.md#range)
- [ref](LogicalExpressionRefNode.md#ref)
- [right](LogicalExpressionRefNode.md#right)
- [type](LogicalExpressionRefNode.md#type)

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

The left argument of the logical expression.

#### Inherited from

[LogicalExpressionSyntaxNode](LogicalExpressionSyntaxNode.md).[left](LogicalExpressionSyntaxNode.md#left)

#### Defined in

[nodes/ConditionNode.ts:101](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L101)

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

• **operator**: [`LogicalOperator`](../enums/LogicalOperator.md)

The operator of the logical expression.

#### Inherited from

[LogicalExpressionSyntaxNode](LogicalExpressionSyntaxNode.md).[operator](LogicalExpressionSyntaxNode.md#operator)

#### Defined in

[nodes/ConditionNode.ts:97](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L97)

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

The right argument of the logical expression.

#### Inherited from

[LogicalExpressionSyntaxNode](LogicalExpressionSyntaxNode.md).[right](LogicalExpressionSyntaxNode.md#right)

#### Defined in

[nodes/ConditionNode.ts:105](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L105)

___

### type

• **type**: [`LogicalExpression`](../enums/SyntaxNodeType.md#logicalexpression)

The type of the syntax node.

#### Overrides

[RefSyntaxNode](RefSyntaxNode.md).[type](RefSyntaxNode.md#type)

#### Defined in

[nodes/ConditionNode.ts:111](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L111)
