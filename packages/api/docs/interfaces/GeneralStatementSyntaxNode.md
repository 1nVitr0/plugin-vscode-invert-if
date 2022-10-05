[vscode-invert-if](../README.md) / [Exports](../modules.md) / GeneralStatementSyntaxNode

# Interface: GeneralStatementSyntaxNode<T, S\>

A syntax node that represents a section of code.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | extends [`SyntaxNode`](SyntaxNode.md)<`T`\> = [`SyntaxNode`](SyntaxNode.md)<`T`\> |

## Hierarchy

- [`SyntaxNode`](SyntaxNode.md)<`T`\>

  ↳ **`GeneralStatementSyntaxNode`**

  ↳↳ [`GeneralStatementRefNode`](GeneralStatementRefNode.md)

  ↳↳ [`GeneralStatementUpdatedNode`](GeneralStatementUpdatedNode.md)

## Table of contents

### Properties

- [argument](GeneralStatementSyntaxNode.md#argument)
- [name](GeneralStatementSyntaxNode.md#name)
- [type](GeneralStatementSyntaxNode.md#type)

## Properties

### argument

• `Optional` **argument**: `S`

The argument of the statement.

#### Defined in

[nodes/GeneralStatementNode.ts:8](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/GeneralStatementNode.ts#L8)

___

### name

• `Optional` **name**: `string`

A descriptive name for the syntax node.

#### Inherited from

[SyntaxNode](SyntaxNode.md).[name](SyntaxNode.md#name)

#### Defined in

[nodes/SyntaxNode.ts:35](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L35)

___

### type

• **type**: [`ReturnStatement`](../enums/SyntaxNodeType.md#returnstatement) \| [`BreakStatement`](../enums/SyntaxNodeType.md#breakstatement) \| [`ContinueStatement`](../enums/SyntaxNodeType.md#continuestatement)

The type of the syntax node.

#### Overrides

[SyntaxNode](SyntaxNode.md).[type](SyntaxNode.md#type)

#### Defined in

[nodes/GeneralStatementNode.ts:4](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/GeneralStatementNode.ts#L4)
