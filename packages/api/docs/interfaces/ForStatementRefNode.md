[vscode-invert-if](../README.md) / [Exports](../modules.md) / ForStatementRefNode

# Interface: ForStatementRefNode<T\>

Syntax node representing a for loop statement.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`ForStatementNode`](ForStatementNode.md)<`T`, [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>\>

- [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

  ↳ **`ForStatementRefNode`**

## Table of contents

### Properties

- [description](ForStatementRefNode.md#description)
- [name](ForStatementRefNode.md#name)
- [range](ForStatementRefNode.md#range)
- [ref](ForStatementRefNode.md#ref)
- [test](ForStatementRefNode.md#test)
- [type](ForStatementRefNode.md#type)

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

### test

• **test**: [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

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

[RefSyntaxNode](RefSyntaxNode.md).[type](RefSyntaxNode.md#type)

#### Defined in

[nodes/LoopNode.ts:15](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L15)
