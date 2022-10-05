[vscode-invert-if](../README.md) / [Exports](../modules.md) / EmptyNode

# Interface: EmptyNode<T\>

Syntax node representing an noop statement.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`SyntaxNode`](SyntaxNode.md)<`T`\>

  ↳ **`EmptyNode`**

  ↳↳ [`EmptyRefNode`](EmptyRefNode.md)

  ↳↳ [`EmptyUpdatedNode`](EmptyUpdatedNode.md)

## Table of contents

### Properties

- [name](EmptyNode.md#name)
- [type](EmptyNode.md#type)

## Properties

### name

• `Optional` **name**: `string`

A descriptive name for the syntax node.

#### Inherited from

[SyntaxNode](SyntaxNode.md).[name](SyntaxNode.md#name)

#### Defined in

[nodes/SyntaxNode.ts:35](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L35)

___

### type

• **type**: [`Empty`](../enums/SyntaxNodeType.md#empty)

The type of the syntax node.

#### Overrides

[SyntaxNode](SyntaxNode.md).[type](SyntaxNode.md#type)

#### Defined in

[nodes/EmptyNode.ts:7](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/EmptyNode.ts#L7)
