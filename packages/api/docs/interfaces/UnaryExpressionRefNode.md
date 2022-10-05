[vscode-invert-if](../README.md) / [Exports](../modules.md) / UnaryExpressionRefNode

# Interface: UnaryExpressionRefNode<T\>

Syntax node representing a unary expression.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`UnaryExpressionSyntaxNode`](UnaryExpressionSyntaxNode.md)<`T`, [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>\>

- [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

  ↳ **`UnaryExpressionRefNode`**

## Table of contents

### Properties

- [argument](UnaryExpressionRefNode.md#argument)
- [description](UnaryExpressionRefNode.md#description)
- [name](UnaryExpressionRefNode.md#name)
- [operator](UnaryExpressionRefNode.md#operator)
- [range](UnaryExpressionRefNode.md#range)
- [ref](UnaryExpressionRefNode.md#ref)
- [type](UnaryExpressionRefNode.md#type)

## Properties

### argument

• **argument**: [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

The argument of the unary expression.

#### Inherited from

[UnaryExpressionSyntaxNode](UnaryExpressionSyntaxNode.md).[argument](UnaryExpressionSyntaxNode.md#argument)

#### Defined in

[nodes/ConditionNode.ts:47](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L47)

___

### description

• `Optional` **description**: `string`

Additional description for the syntax node.

#### Inherited from

[RefSyntaxNode](RefSyntaxNode.md).[description](RefSyntaxNode.md#description)

#### Defined in

[nodes/SyntaxNode.ts:51](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L51)

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

• **operator**: [`UnaryOperator`](../enums/UnaryOperator.md)

The operator of the unary expression.

#### Inherited from

[UnaryExpressionSyntaxNode](UnaryExpressionSyntaxNode.md).[operator](UnaryExpressionSyntaxNode.md#operator)

#### Defined in

[nodes/ConditionNode.ts:43](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L43)

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

### type

• **type**: [`UnaryExpression`](../enums/SyntaxNodeType.md#unaryexpression)

The type of the syntax node.

#### Overrides

[RefSyntaxNode](RefSyntaxNode.md).[type](RefSyntaxNode.md#type)

#### Defined in

[nodes/ConditionNode.ts:51](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L51)
