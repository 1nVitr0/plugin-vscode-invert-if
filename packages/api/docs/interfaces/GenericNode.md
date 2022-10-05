[vscode-invert-if](../README.md) / [Exports](../modules.md) / GenericNode

# Interface: GenericNode<T\>

Syntax node representing a generic node, that is not included in [SyntaxNodeType](../enums/SyntaxNodeType.md).

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`SyntaxNode`](SyntaxNode.md)<`T`\>

  ↳ **`GenericNode`**

  ↳↳ [`GenericRefNode`](GenericRefNode.md)

  ↳↳ [`GenericUpdatedNode`](GenericUpdatedNode.md)

## Table of contents

### Properties

- [name](GenericNode.md#name)
- [type](GenericNode.md#type)

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

• **type**: [`Generic`](../enums/SyntaxNodeType.md#generic)

The type of the syntax node.

#### Overrides

[SyntaxNode](SyntaxNode.md).[type](SyntaxNode.md#type)

#### Defined in

[nodes/GenericNode.ts:7](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/GenericNode.ts#L7)
