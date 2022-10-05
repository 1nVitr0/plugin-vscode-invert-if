[vscode-invert-if](../README.md) / [Exports](../modules.md) / RefSyntaxNode

# Interface: RefSyntaxNode<T\>

A syntax node that represents a section of code.
It holds a direct reference to a syntax node in the original document,
provided by a language support plugin.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`SyntaxNode`](SyntaxNode.md)<`T`\>

  ↳ **`RefSyntaxNode`**

  ↳↳ [`EmptyRefNode`](EmptyRefNode.md)

  ↳↳ [`GeneralStatementRefNode`](GeneralStatementRefNode.md)

  ↳↳ [`UnaryExpressionRefNode`](UnaryExpressionRefNode.md)

  ↳↳ [`BinaryExpressionRefNode`](BinaryExpressionRefNode.md)

  ↳↳ [`LogicalExpressionRefNode`](LogicalExpressionRefNode.md)

  ↳↳ [`IfStatementRefNode`](IfStatementRefNode.md)

  ↳↳ [`ForStatementRefNode`](ForStatementRefNode.md)

  ↳↳ [`WhileStatementRefNode`](WhileStatementRefNode.md)

  ↳↳ [`DoWhileStatementRefNode`](DoWhileStatementRefNode.md)

  ↳↳ [`FunctionDeclarationRefNode`](FunctionDeclarationRefNode.md)

  ↳↳ [`GenericRefNode`](GenericRefNode.md)

## Table of contents

### Properties

- [description](RefSyntaxNode.md#description)
- [name](RefSyntaxNode.md#name)
- [range](RefSyntaxNode.md#range)
- [ref](RefSyntaxNode.md#ref)
- [type](RefSyntaxNode.md#type)

## Properties

### description

• `Optional` **description**: `string`

Additional description for the syntax node.

#### Defined in

[nodes/SyntaxNode.ts:51](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L51)

___

### name

• `Optional` **name**: `string`

A descriptive name for the syntax node.

#### Inherited from

[SyntaxNode](SyntaxNode.md).[name](SyntaxNode.md#name)

#### Defined in

[nodes/SyntaxNode.ts:35](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L35)

___

### range

• **range**: `Range`

The range of the code represented by the syntax node.

#### Defined in

[nodes/SyntaxNode.ts:47](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L47)

___

### ref

• **ref**: `T`

The original syntax node.

#### Defined in

[nodes/SyntaxNode.ts:55](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L55)

___

### type

• **type**: [`SyntaxNodeType`](../enums/SyntaxNodeType.md)

The type of the syntax node.

#### Inherited from

[SyntaxNode](SyntaxNode.md).[type](SyntaxNode.md#type)

#### Defined in

[nodes/SyntaxNode.ts:31](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L31)
