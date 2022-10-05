[vscode-invert-if](../README.md) / [Exports](../modules.md) / IfStatementSyntaxNode

# Interface: IfStatementSyntaxNode<T, S\>

Syntax node representing an if statement.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | extends [`SyntaxNode`](SyntaxNode.md)<`T`\> = [`SyntaxNode`](SyntaxNode.md)<`T`\> |

## Hierarchy

- [`SyntaxNode`](SyntaxNode.md)<`T`\>

  ↳ **`IfStatementSyntaxNode`**

  ↳↳ [`IfStatementRefNode`](IfStatementRefNode.md)

  ↳↳ [`IfStatementUpdatedNode`](IfStatementUpdatedNode.md)

## Table of contents

### Properties

- [alternate](IfStatementSyntaxNode.md#alternate)
- [consequent](IfStatementSyntaxNode.md#consequent)
- [name](IfStatementSyntaxNode.md#name)
- [test](IfStatementSyntaxNode.md#test)
- [type](IfStatementSyntaxNode.md#type)

## Properties

### alternate

• `Optional` **alternate**: `S`

The body of the else statement.s

#### Defined in

[nodes/IfStatementNode.ts:19](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/IfStatementNode.ts#L19)

___

### consequent

• **consequent**: `S`

The body of the if statement.

#### Defined in

[nodes/IfStatementNode.ts:15](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/IfStatementNode.ts#L15)

___

### name

• `Optional` **name**: `string`

A descriptive name for the syntax node.

#### Inherited from

[SyntaxNode](SyntaxNode.md).[name](SyntaxNode.md#name)

#### Defined in

[nodes/SyntaxNode.ts:35](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L35)

___

### test

• **test**: `S`

The test condition of the if statement.

#### Defined in

[nodes/IfStatementNode.ts:11](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/IfStatementNode.ts#L11)

___

### type

• **type**: [`IfStatement`](../enums/SyntaxNodeType.md#ifstatement)

The type of the syntax node.

#### Overrides

[SyntaxNode](SyntaxNode.md).[type](SyntaxNode.md#type)

#### Defined in

[nodes/IfStatementNode.ts:7](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/IfStatementNode.ts#L7)
