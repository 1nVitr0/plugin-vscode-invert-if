[vscode-invert-if](../README.md) / [Exports](../modules.md) / ForStatementUpdatedNode

# Interface: ForStatementUpdatedNode<T\>

Syntax node representing a for loop statement.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`ForStatementNode`](ForStatementNode.md)<`T`, [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>\>

- [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

  ↳ **`ForStatementUpdatedNode`**

## Table of contents

### Properties

- [changed](ForStatementUpdatedNode.md#changed)
- [created](ForStatementUpdatedNode.md#created)
- [description](ForStatementUpdatedNode.md#description)
- [name](ForStatementUpdatedNode.md#name)
- [range](ForStatementUpdatedNode.md#range)
- [ref](ForStatementUpdatedNode.md#ref)
- [removed](ForStatementUpdatedNode.md#removed)
- [test](ForStatementUpdatedNode.md#test)
- [type](ForStatementUpdatedNode.md#type)

## Properties

### changed

• `Optional` **changed**: ``true``

Wether the syntax node has been updated.

#### Inherited from

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[changed](UpdatedSyntaxNode.md#changed)

#### Defined in

[nodes/SyntaxNode.ts:67](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L67)

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

The test condition of the loop header.

#### Inherited from

[ForStatementNode](ForStatementNode.md).[test](ForStatementNode.md#test)

#### Defined in

[nodes/LoopNode.ts:11](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L11)

___

### type

• **type**: [`ForStatement`](../enums/SyntaxNodeType.md#forstatement)

The type of the syntax node.

#### Overrides

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[type](UpdatedSyntaxNode.md#type)

#### Defined in

[nodes/LoopNode.ts:19](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L19)
