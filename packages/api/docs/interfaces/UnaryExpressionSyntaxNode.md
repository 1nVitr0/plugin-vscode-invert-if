[vscode-invert-if](../README.md) / [Exports](../modules.md) / UnaryExpressionSyntaxNode

# Interface: UnaryExpressionSyntaxNode<T, S\>

Syntax node representing a unary expression.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | extends [`SyntaxNode`](SyntaxNode.md)<`T`\> = [`SyntaxNode`](SyntaxNode.md)<`T`\> |

## Hierarchy

- [`SyntaxNode`](SyntaxNode.md)<`T`\>

  ↳ **`UnaryExpressionSyntaxNode`**

  ↳↳ [`UnaryExpressionRefNode`](UnaryExpressionRefNode.md)

  ↳↳ [`UnaryExpressionUpdatedNode`](UnaryExpressionUpdatedNode.md)

## Table of contents

### Properties

- [argument](UnaryExpressionSyntaxNode.md#argument)
- [name](UnaryExpressionSyntaxNode.md#name)
- [operator](UnaryExpressionSyntaxNode.md#operator)
- [type](UnaryExpressionSyntaxNode.md#type)

## Properties

### argument

• **argument**: `S`

The argument of the unary expression.

#### Defined in

[nodes/ConditionNode.ts:47](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L47)

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

• **operator**: [`UnaryOperator`](../enums/UnaryOperator.md)

The operator of the unary expression.

#### Defined in

[nodes/ConditionNode.ts:43](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L43)

___

### type

• **type**: [`UnaryExpression`](../enums/SyntaxNodeType.md#unaryexpression)

The type of the syntax node.

#### Overrides

[SyntaxNode](SyntaxNode.md).[type](SyntaxNode.md#type)

#### Defined in

[nodes/ConditionNode.ts:39](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L39)
