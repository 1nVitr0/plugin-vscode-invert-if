[vscode-invert-if](../README.md) / [Exports](../modules.md) / EmptyRefNode

# Interface: EmptyRefNode<T\>

Syntax node representing an noop statement.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`EmptyNode`](EmptyNode.md)<`T`\>

- [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

  ↳ **`EmptyRefNode`**

## Table of contents

### Properties

- [description](EmptyRefNode.md#description)
- [name](EmptyRefNode.md#name)
- [range](EmptyRefNode.md#range)
- [ref](EmptyRefNode.md#ref)
- [type](EmptyRefNode.md#type)

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

• **type**: [`Empty`](../enums/SyntaxNodeType.md#empty)

The type of the syntax node.

#### Overrides

[RefSyntaxNode](RefSyntaxNode.md).[type](RefSyntaxNode.md#type)

#### Defined in

[nodes/EmptyNode.ts:11](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/EmptyNode.ts#L11)
