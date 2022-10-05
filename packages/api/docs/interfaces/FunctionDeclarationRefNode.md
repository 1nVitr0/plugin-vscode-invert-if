[vscode-invert-if](../README.md) / [Exports](../modules.md) / FunctionDeclarationRefNode

# Interface: FunctionDeclarationRefNode<T\>

Syntax node representing a function declaration.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`FunctionDeclarationNode`](FunctionDeclarationNode.md)<`T`\>

- [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

  ↳ **`FunctionDeclarationRefNode`**

## Table of contents

### Properties

- [description](FunctionDeclarationRefNode.md#description)
- [name](FunctionDeclarationRefNode.md#name)
- [range](FunctionDeclarationRefNode.md#range)
- [ref](FunctionDeclarationRefNode.md#ref)
- [type](FunctionDeclarationRefNode.md#type)

## Properties

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

• **type**: [`FunctionDeclaration`](../enums/SyntaxNodeType.md#functiondeclaration)

The type of the syntax node.

#### Overrides

[RefSyntaxNode](RefSyntaxNode.md).[type](RefSyntaxNode.md#type)

#### Defined in

[nodes/FunctionDeclarationNode.ts:11](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/FunctionDeclarationNode.ts#L11)
