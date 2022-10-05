[vscode-invert-if](../README.md) / [Exports](../modules.md) / WhileStatementNode

# Interface: WhileStatementNode<T, S\>

Syntax node representing a while loop statement.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | extends [`SyntaxNode`](SyntaxNode.md)<`T`\> = [`SyntaxNode`](SyntaxNode.md)<`T`\> |

## Hierarchy

- [`SyntaxNode`](SyntaxNode.md)<`T`\>

  ↳ **`WhileStatementNode`**

  ↳↳ [`WhileStatementRefNode`](WhileStatementRefNode.md)

  ↳↳ [`WhileStatementUpdatedNode`](WhileStatementUpdatedNode.md)

## Table of contents

### Properties

- [name](WhileStatementNode.md#name)
- [test](WhileStatementNode.md#test)
- [type](WhileStatementNode.md#type)

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

[nodes/LoopNode.ts:30](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L30)

___

### type

• **type**: [`WhileStatement`](../enums/SyntaxNodeType.md#whilestatement)

The type of the syntax node.

#### Overrides

[SyntaxNode](SyntaxNode.md).[type](SyntaxNode.md#type)

#### Defined in

[nodes/LoopNode.ts:26](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L26)
