[vscode-invert-if](../README.md) / [Exports](../modules.md) / ForStatementNode

# Interface: ForStatementNode<T, S\>

Syntax node representing a for loop statement.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | extends [`SyntaxNode`](SyntaxNode.md)<`T`\> = [`SyntaxNode`](SyntaxNode.md)<`T`\> |

## Hierarchy

- [`SyntaxNode`](SyntaxNode.md)<`T`\>

  ↳ **`ForStatementNode`**

  ↳↳ [`ForStatementRefNode`](ForStatementRefNode.md)

  ↳↳ [`ForStatementUpdatedNode`](ForStatementUpdatedNode.md)

## Table of contents

### Properties

- [name](ForStatementNode.md#name)
- [test](ForStatementNode.md#test)
- [type](ForStatementNode.md#type)

## Properties

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

The test condition of the loop header.

#### Defined in

[nodes/LoopNode.ts:11](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L11)

___

### type

• **type**: [`ForStatement`](../enums/SyntaxNodeType.md#forstatement)

The type of the syntax node.

#### Overrides

[SyntaxNode](SyntaxNode.md).[type](SyntaxNode.md#type)

#### Defined in

[nodes/LoopNode.ts:7](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L7)
