[vscode-invert-if](../README.md) / [Exports](../modules.md) / ExpressionContext

# Interface: ExpressionContext<T\>

Additional information about the context in which a condition is used.
This is used by providers that create guard clauses.

**`See`**

GuardClauseProvider

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [parent](ExpressionContext.md#parent)
- [root](ExpressionContext.md#root)

## Properties

### parent

• **parent**: [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

The direct parent syntax node of the condition.
This is usually an if statement or a loop header

#### Defined in

[context/ExpressionContext.ts:20](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/context/ExpressionContext.ts#L20)

___

### root

• **root**: [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>

The "root" syntax node that contains the condition.
This is the main constructs that wraps the condition,
usually a function, or a loop

#### Defined in

[context/ExpressionContext.ts:15](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/context/ExpressionContext.ts#L15)
