[vscode-invert-if](../README.md) / [Exports](../modules.md) / IfStatementRefNode

# Interface: IfStatementRefNode<T\>

Syntax node representing an if statement.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`IfStatementSyntaxNode`](IfStatementSyntaxNode.md)<`T`, [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>\>

- [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

  ↳ **`IfStatementRefNode`**

## Table of contents

### Properties

- [alternate](IfStatementRefNode.md#alternate)
- [consequent](IfStatementRefNode.md#consequent)
- [description](IfStatementRefNode.md#description)
- [name](IfStatementRefNode.md#name)
- [range](IfStatementRefNode.md#range)
- [ref](IfStatementRefNode.md#ref)
- [test](IfStatementRefNode.md#test)
- [type](IfStatementRefNode.md#type)

## Properties

### alternate

• `Optional` **alternate**: [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

The body of the else statement.s

#### Inherited from

[IfStatementSyntaxNode](IfStatementSyntaxNode.md).[alternate](IfStatementSyntaxNode.md#alternate)

#### Defined in

[nodes/IfStatementNode.ts:19](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/IfStatementNode.ts#L19)

___

### consequent

• **consequent**: [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

The body of the if statement.

#### Inherited from

[IfStatementSyntaxNode](IfStatementSyntaxNode.md).[consequent](IfStatementSyntaxNode.md#consequent)

#### Defined in

[nodes/IfStatementNode.ts:15](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/IfStatementNode.ts#L15)

___

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

### test

• **test**: [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

The test condition of the if statement.

#### Inherited from

[IfStatementSyntaxNode](IfStatementSyntaxNode.md).[test](IfStatementSyntaxNode.md#test)

#### Defined in

[nodes/IfStatementNode.ts:11](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/IfStatementNode.ts#L11)

___

### type

• **type**: [`IfStatement`](../enums/SyntaxNodeType.md#ifstatement)

The type of the syntax node.

#### Overrides

[RefSyntaxNode](RefSyntaxNode.md).[type](RefSyntaxNode.md#type)

#### Defined in

[nodes/IfStatementNode.ts:23](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/IfStatementNode.ts#L23)
