[vscode-invert-if](../README.md) / [Exports](../modules.md) / DoWhileStatementNode

# Interface: DoWhileStatementNode<T, S\>

Syntax node representing a do-while loop statement.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | extends [`SyntaxNode`](SyntaxNode.md)<`T`\> = [`SyntaxNode`](SyntaxNode.md)<`T`\> |

## Hierarchy

- [`SyntaxNode`](SyntaxNode.md)<`T`\>

  ↳ **`DoWhileStatementNode`**

  ↳↳ [`DoWhileStatementRefNode`](DoWhileStatementRefNode.md)

  ↳↳ [`DoWhileStatementUpdatedNode`](DoWhileStatementUpdatedNode.md)

## Table of contents

### Properties

- [name](DoWhileStatementNode.md#name)
- [test](DoWhileStatementNode.md#test)
- [type](DoWhileStatementNode.md#type)

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

The test condition of the loop footer.

#### Defined in

[nodes/LoopNode.ts:51](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L51)

___

### type

• **type**: [`DoWhileStatement`](../enums/SyntaxNodeType.md#dowhilestatement)

The type of the syntax node.

#### Overrides

[SyntaxNode](SyntaxNode.md).[type](SyntaxNode.md#type)

#### Defined in

[nodes/LoopNode.ts:47](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L47)
