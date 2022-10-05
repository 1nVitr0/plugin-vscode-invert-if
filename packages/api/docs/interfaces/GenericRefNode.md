[vscode-invert-if](../README.md) / [Exports](../modules.md) / GenericRefNode

# Interface: GenericRefNode<T\>

Syntax node representing a generic node, that is not included in [SyntaxNodeType](../enums/SyntaxNodeType.md).

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`GenericNode`](GenericNode.md)<`T`\>

- [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

  ↳ **`GenericRefNode`**

## Table of contents

### Properties

- [description](GenericRefNode.md#description)
- [name](GenericRefNode.md#name)
- [range](GenericRefNode.md#range)
- [ref](GenericRefNode.md#ref)
- [type](GenericRefNode.md#type)

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

• **type**: [`Generic`](../enums/SyntaxNodeType.md#generic)

The type of the syntax node.

#### Overrides

[RefSyntaxNode](RefSyntaxNode.md).[type](RefSyntaxNode.md#type)

#### Defined in

[nodes/GenericNode.ts:11](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/GenericNode.ts#L11)
