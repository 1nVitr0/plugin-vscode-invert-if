[vscode-invert-if](../README.md) / [Exports](../modules.md) / UpdatedSyntaxNode

# Interface: UpdatedSyntaxNode<T\>

A syntax node that has been updated or created by the extension.
It may no longer hold a reference to the original syntax node.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- `Partial`<[`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>\>

  ↳ **`UpdatedSyntaxNode`**

  ↳↳ [`EmptyUpdatedNode`](EmptyUpdatedNode.md)

  ↳↳ [`GeneralStatementUpdatedNode`](GeneralStatementUpdatedNode.md)

  ↳↳ [`UnaryExpressionUpdatedNode`](UnaryExpressionUpdatedNode.md)

  ↳↳ [`BinaryExpressionUpdatedNode`](BinaryExpressionUpdatedNode.md)

  ↳↳ [`LogicalExpressionUpdatedNode`](LogicalExpressionUpdatedNode.md)

  ↳↳ [`IfStatementUpdatedNode`](IfStatementUpdatedNode.md)

  ↳↳ [`ForStatementUpdatedNode`](ForStatementUpdatedNode.md)

  ↳↳ [`WhileStatementUpdatedNode`](WhileStatementUpdatedNode.md)

  ↳↳ [`DoWhileStatementUpdatedNode`](DoWhileStatementUpdatedNode.md)

  ↳↳ [`FunctionDeclarationUpdatedNode`](FunctionDeclarationUpdatedNode.md)

  ↳↳ [`GenericUpdatedNode`](GenericUpdatedNode.md)

## Table of contents

### Properties

- [changed](UpdatedSyntaxNode.md#changed)
- [created](UpdatedSyntaxNode.md#created)
- [description](UpdatedSyntaxNode.md#description)
- [name](UpdatedSyntaxNode.md#name)
- [range](UpdatedSyntaxNode.md#range)
- [ref](UpdatedSyntaxNode.md#ref)
- [removed](UpdatedSyntaxNode.md#removed)
- [type](UpdatedSyntaxNode.md#type)

## Properties

### changed

• `Optional` **changed**: ``true``

Wether the syntax node has been updated.

#### Defined in

[nodes/SyntaxNode.ts:67](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L67)

___

### created

• `Optional` **created**: ``true``

Wether the syntax node has been added.

#### Defined in

[nodes/SyntaxNode.ts:75](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L75)

___

### description

• `Optional` **description**: `string`

Additional description for the syntax node.

#### Inherited from

Partial.description

#### Defined in

[nodes/SyntaxNode.ts:51](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L51)

___

### name

• `Optional` **name**: `string`

A descriptive name for the syntax node.

#### Inherited from

Partial.name

#### Defined in

[nodes/SyntaxNode.ts:35](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L35)

___

### range

• `Optional` **range**: `Range`

The range of the code represented by the syntax node.

#### Inherited from

Partial.range

#### Defined in

[nodes/SyntaxNode.ts:47](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L47)

___

### ref

• `Optional` **ref**: `T`

The original syntax node.

#### Inherited from

Partial.ref

#### Defined in

[nodes/SyntaxNode.ts:55](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L55)

___

### removed

• `Optional` **removed**: ``true``

Wether the syntax node has been removed.

#### Defined in

[nodes/SyntaxNode.ts:71](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L71)

___

### type

• **type**: [`SyntaxNodeType`](../enums/SyntaxNodeType.md)

#### Overrides

Partial.type

#### Defined in

[nodes/SyntaxNode.ts:63](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L63)
