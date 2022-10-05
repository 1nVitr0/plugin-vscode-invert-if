[vscode-invert-if](../README.md) / [Exports](../modules.md) / UnaryExpressionUpdatedNode

# Interface: UnaryExpressionUpdatedNode<T\>

Syntax node representing a unary expression.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`UnaryExpressionSyntaxNode`](UnaryExpressionSyntaxNode.md)<`T`, [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>\>

- [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

  ↳ **`UnaryExpressionUpdatedNode`**

## Table of contents

### Properties

- [argument](UnaryExpressionUpdatedNode.md#argument)
- [changed](UnaryExpressionUpdatedNode.md#changed)
- [created](UnaryExpressionUpdatedNode.md#created)
- [description](UnaryExpressionUpdatedNode.md#description)
- [name](UnaryExpressionUpdatedNode.md#name)
- [operator](UnaryExpressionUpdatedNode.md#operator)
- [range](UnaryExpressionUpdatedNode.md#range)
- [ref](UnaryExpressionUpdatedNode.md#ref)
- [removed](UnaryExpressionUpdatedNode.md#removed)
- [type](UnaryExpressionUpdatedNode.md#type)

## Properties

### argument

• **argument**: [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

The argument of the unary expression.

#### Inherited from

[UnaryExpressionSyntaxNode](UnaryExpressionSyntaxNode.md).[argument](UnaryExpressionSyntaxNode.md#argument)

#### Defined in

[nodes/ConditionNode.ts:47](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L47)

___

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

### name

• `Optional` **name**: `string`

A descriptive name for the syntax node.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[name](UpdatedSyntaxNode.md#name)

#### Defined in

[nodes/SyntaxNode.ts:35](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L35)

___

### operator

• **operator**: [`UnaryOperator`](../enums/UnaryOperator.md)

The operator of the unary expression.

#### Inherited from

[UnaryExpressionSyntaxNode](UnaryExpressionSyntaxNode.md).[operator](UnaryExpressionSyntaxNode.md#operator)

#### Defined in

[nodes/ConditionNode.ts:43](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L43)

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

### type

• **type**: [`UnaryExpression`](../enums/SyntaxNodeType.md#unaryexpression)

The type of the syntax node.

#### Overrides

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[type](UpdatedSyntaxNode.md#type)

#### Defined in

[nodes/ConditionNode.ts:57](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L57)
