[vscode-invert-if](../README.md) / [Exports](../modules.md) / GeneralStatementUpdatedNode

# Interface: GeneralStatementUpdatedNode<T\>

A syntax node that represents a section of code.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`GeneralStatementSyntaxNode`](GeneralStatementSyntaxNode.md)<`T`, [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>\>

- [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

  ↳ **`GeneralStatementUpdatedNode`**

## Table of contents

### Properties

- [argument](GeneralStatementUpdatedNode.md#argument)
- [changed](GeneralStatementUpdatedNode.md#changed)
- [created](GeneralStatementUpdatedNode.md#created)
- [description](GeneralStatementUpdatedNode.md#description)
- [name](GeneralStatementUpdatedNode.md#name)
- [range](GeneralStatementUpdatedNode.md#range)
- [ref](GeneralStatementUpdatedNode.md#ref)
- [removed](GeneralStatementUpdatedNode.md#removed)
- [type](GeneralStatementUpdatedNode.md#type)

## Properties

### argument

• `Optional` **argument**: [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\>

The argument of the statement.

#### Inherited from

[GeneralStatementSyntaxNode](GeneralStatementSyntaxNode.md).[argument](GeneralStatementSyntaxNode.md#argument)

#### Defined in

[nodes/GeneralStatementNode.ts:8](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/GeneralStatementNode.ts#L8)

___

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

### type

• **type**: [`ReturnStatement`](../enums/SyntaxNodeType.md#returnstatement) \| [`BreakStatement`](../enums/SyntaxNodeType.md#breakstatement) \| [`ContinueStatement`](../enums/SyntaxNodeType.md#continuestatement)

The type of the syntax node.

#### Overrides

[UpdatedSyntaxNode](UpdatedSyntaxNode.md).[type](UpdatedSyntaxNode.md#type)

#### Defined in

[nodes/GeneralStatementNode.ts:18](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/GeneralStatementNode.ts#L18)
