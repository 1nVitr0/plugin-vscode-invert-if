[vscode-invert-if](../README.md) / [Exports](../modules.md) / FunctionDeclarationNode

# Interface: FunctionDeclarationNode<T\>

Syntax node representing a function declaration.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`SyntaxNode`](SyntaxNode.md)<`T`\>

  ↳ **`FunctionDeclarationNode`**

  ↳↳ [`FunctionDeclarationRefNode`](FunctionDeclarationRefNode.md)

  ↳↳ [`FunctionDeclarationUpdatedNode`](FunctionDeclarationUpdatedNode.md)

## Table of contents

### Properties

- [name](FunctionDeclarationNode.md#name)
- [type](FunctionDeclarationNode.md#type)

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

• **type**: [`FunctionDeclaration`](../enums/SyntaxNodeType.md#functiondeclaration)

The type of the syntax node.

#### Overrides

[SyntaxNode](SyntaxNode.md).[type](SyntaxNode.md#type)

#### Defined in

[nodes/FunctionDeclarationNode.ts:7](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/FunctionDeclarationNode.ts#L7)
