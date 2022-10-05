[vscode-invert-if](../README.md) / [Exports](../modules.md) / LogicalExpressionUpdatedNode

# Interface: LogicalExpressionUpdatedNode<T\>

Syntax node representing a logical expression.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`LogicalExpressionSyntaxNode`](LogicalExpressionSyntaxNode.md)<`T`, [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>\>

- [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

  ↳ **`LogicalExpressionUpdatedNode`**

## Table of contents

### Properties

- [changed](LogicalExpressionUpdatedNode.md#changed)
- [created](LogicalExpressionUpdatedNode.md#created)
- [description](LogicalExpressionUpdatedNode.md#description)
- [left](LogicalExpressionUpdatedNode.md#left)
- [name](LogicalExpressionUpdatedNode.md#name)
- [operator](LogicalExpressionUpdatedNode.md#operator)
- [range](LogicalExpressionUpdatedNode.md#range)
- [ref](LogicalExpressionUpdatedNode.md#ref)
- [removed](LogicalExpressionUpdatedNode.md#removed)
- [right](LogicalExpressionUpdatedNode.md#right)
- [type](LogicalExpressionUpdatedNode.md#type)

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

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[name](UpdatedSyntaxNode.md#name)

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

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[type](UpdatedSyntaxNode.md#type)

#### Defined in

[nodes/ConditionNode.ts:117](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L117)
