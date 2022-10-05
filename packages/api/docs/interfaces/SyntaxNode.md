[vscode-invert-if](../README.md) / [Exports](../modules.md) / SyntaxNode

# Interface: SyntaxNode<T\>

A syntax node that represents a section of code.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- **`SyntaxNode`**

  ↳ [`RefSyntaxNode`](RefSyntaxNode.md)

  ↳ [`EmptyNode`](EmptyNode.md)

  ↳ [`GeneralStatementSyntaxNode`](GeneralStatementSyntaxNode.md)

  ↳ [`UnaryExpressionSyntaxNode`](UnaryExpressionSyntaxNode.md)

  ↳ [`BinaryExpressionSyntaxNode`](BinaryExpressionSyntaxNode.md)

  ↳ [`LogicalExpressionSyntaxNode`](LogicalExpressionSyntaxNode.md)

  ↳ [`IfStatementSyntaxNode`](IfStatementSyntaxNode.md)

  ↳ [`ForStatementNode`](ForStatementNode.md)

  ↳ [`WhileStatementNode`](WhileStatementNode.md)

  ↳ [`DoWhileStatementNode`](DoWhileStatementNode.md)

  ↳ [`FunctionDeclarationNode`](FunctionDeclarationNode.md)

  ↳ [`GenericNode`](GenericNode.md)

## Table of contents

### Properties

- [name](SyntaxNode.md#name)
- [type](SyntaxNode.md#type)

## Properties

### name

• `Optional` **name**: `string`

A descriptive name for the syntax node.

#### Defined in

[nodes/SyntaxNode.ts:35](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L35)

___

### type

• **type**: [`SyntaxNodeType`](../enums/SyntaxNodeType.md)

The type of the syntax node.

#### Defined in

[nodes/SyntaxNode.ts:31](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L31)
