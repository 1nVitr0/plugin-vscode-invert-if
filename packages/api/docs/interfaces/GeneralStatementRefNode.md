[vscode-invert-if](../README.md) / [Exports](../modules.md) / GeneralStatementRefNode

# Interface: GeneralStatementRefNode<T\>

A syntax node that represents a section of code.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`GeneralStatementSyntaxNode`](GeneralStatementSyntaxNode.md)<`T`, [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>\>

- [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

  ↳ **`GeneralStatementRefNode`**

## Table of contents

### Properties

- [argument](GeneralStatementRefNode.md#argument)
- [description](GeneralStatementRefNode.md#description)
- [name](GeneralStatementRefNode.md#name)
- [range](GeneralStatementRefNode.md#range)
- [ref](GeneralStatementRefNode.md#ref)
- [type](GeneralStatementRefNode.md#type)

## Properties

### argument

• `Optional` **argument**: [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

The argument of the statement.

#### Inherited from

[GeneralStatementSyntaxNode](GeneralStatementSyntaxNode.md).[argument](GeneralStatementSyntaxNode.md#argument)

#### Defined in

[nodes/GeneralStatementNode.ts:8](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/GeneralStatementNode.ts#L8)

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

### type

• **type**: [`ReturnStatement`](../enums/SyntaxNodeType.md#returnstatement) \| [`BreakStatement`](../enums/SyntaxNodeType.md#breakstatement) \| [`ContinueStatement`](../enums/SyntaxNodeType.md#continuestatement)

The type of the syntax node.

#### Overrides

[RefSyntaxNode](RefSyntaxNode.md).[type](RefSyntaxNode.md#type)

#### Defined in

[nodes/GeneralStatementNode.ts:12](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/GeneralStatementNode.ts#L12)
