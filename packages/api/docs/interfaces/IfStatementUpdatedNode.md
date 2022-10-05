[vscode-invert-if](../README.md) / [Exports](../modules.md) / IfStatementUpdatedNode

# Interface: IfStatementUpdatedNode<T\>

Syntax node representing an if statement.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`IfStatementSyntaxNode`](IfStatementSyntaxNode.md)<`T`, [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>\>

- [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

  ↳ **`IfStatementUpdatedNode`**

## Table of contents

### Properties

- [alternate](IfStatementUpdatedNode.md#alternate)
- [changed](IfStatementUpdatedNode.md#changed)
- [consequent](IfStatementUpdatedNode.md#consequent)
- [created](IfStatementUpdatedNode.md#created)
- [description](IfStatementUpdatedNode.md#description)
- [name](IfStatementUpdatedNode.md#name)
- [range](IfStatementUpdatedNode.md#range)
- [ref](IfStatementUpdatedNode.md#ref)
- [removed](IfStatementUpdatedNode.md#removed)
- [test](IfStatementUpdatedNode.md#test)
- [type](IfStatementUpdatedNode.md#type)

## Properties

### alternate

• `Optional` **alternate**: [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

The body of the else statement.s

#### Inherited from

[IfStatementSyntaxNode](IfStatementSyntaxNode.md).[alternate](IfStatementSyntaxNode.md#alternate)

#### Defined in

[nodes/IfStatementNode.ts:19](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/IfStatementNode.ts#L19)

___

### changed

• `Optional` **changed**: ``true``

Wether the syntax node has been updated.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[changed](UpdatedSyntaxNode.md#changed)

#### Defined in

[nodes/SyntaxNode.ts:67](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L67)

___

### consequent

• **consequent**: [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

The body of the if statement.

#### Inherited from

[IfStatementSyntaxNode](IfStatementSyntaxNode.md).[consequent](IfStatementSyntaxNode.md#consequent)

#### Defined in

[nodes/IfStatementNode.ts:15](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/IfStatementNode.ts#L15)

___

### created

• `Optional` **created**: ``true``

Wether the syntax node has been added.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[created](UpdatedSyntaxNode.md#created)

#### Defined in

[nodes/SyntaxNode.ts:75](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L75)

___

### description

• `Optional` **description**: `string`

Additional description for the syntax node.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[description](UpdatedSyntaxNode.md#description)

#### Defined in

[nodes/SyntaxNode.ts:51](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L51)

___

### name

• `Optional` **name**: `string`

A descriptive name for the syntax node.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[name](UpdatedSyntaxNode.md#name)

#### Defined in

[nodes/SyntaxNode.ts:35](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L35)

___

### range

• `Optional` **range**: `Range`

The range of the code represented by the syntax node.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[range](UpdatedSyntaxNode.md#range)

#### Defined in

[nodes/SyntaxNode.ts:47](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L47)

___

### ref

• `Optional` **ref**: `T`

The original syntax node.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[ref](UpdatedSyntaxNode.md#ref)

#### Defined in

[nodes/SyntaxNode.ts:55](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L55)

___

### removed

• `Optional` **removed**: ``true``

Wether the syntax node has been removed.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[removed](UpdatedSyntaxNode.md#removed)

#### Defined in

[nodes/SyntaxNode.ts:71](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L71)

___

### test

• **test**: [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

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

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[type](UpdatedSyntaxNode.md#type)

#### Defined in

[nodes/IfStatementNode.ts:29](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/IfStatementNode.ts#L29)
