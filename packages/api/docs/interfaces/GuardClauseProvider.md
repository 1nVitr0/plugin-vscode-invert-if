[vscode-invert-if](../README.md) / [Exports](../modules.md) / GuardClauseProvider

# Interface: GuardClauseProvider<T\>

A provider that can be registered to handle the creation of guard clauses.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`InvertConditionProvider`](InvertConditionProvider.md)<`T`\>

  ↳ **`GuardClauseProvider`**

## Table of contents

### Methods

- [appendSyntaxNode](GuardClauseProvider.md#appendsyntaxnode)
- [insertSyntaxNodeAfter](GuardClauseProvider.md#insertsyntaxnodeafter)
- [insertSyntaxNodeBefore](GuardClauseProvider.md#insertsyntaxnodebefore)
- [prependSyntaxNode](GuardClauseProvider.md#prependsyntaxnode)
- [provideConditions](GuardClauseProvider.md#provideconditions)
- [removeCondition](GuardClauseProvider.md#removecondition)
- [replaceCondition](GuardClauseProvider.md#replacecondition)
- [resolveCondition](GuardClauseProvider.md#resolvecondition)

## Methods

### appendSyntaxNode

▸ **appendSyntaxNode**(`document`, `edit`, `node`, `root`): `void`

Append the given syntax node to the root syntax node specified.
This is usually an if statement used as a guard clause.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `document` | `TextDocument` | The document in which to add the condition |
| `edit` | `TextEditorEdit` | The edit builder to use to add the condition |
| `node` | [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\> | The syntax node to append (this may not contain any references and could need to be rebuilt) |
| `root` | [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\> | The root syntax node to append to (this always contains a reference to the original syntax node) |

#### Returns

`void`

#### Defined in

[providers/GuardClauseProvider.ts:73](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/GuardClauseProvider.ts#L73)

___

### insertSyntaxNodeAfter

▸ **insertSyntaxNodeAfter**(`document`, `edit`, `node`, `after`): `void`

Insert the given syntax node after the specified `after` syntax node.
This is usually an if statement used as a guard clause.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `document` | `TextDocument` | The document in which to add the condition |
| `edit` | `TextEditorEdit` | The edit builder to use to add the condition |
| `node` | [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\> | The syntax node to insert (this may not contain any references and could need to be rebuilt) |
| `after` | [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\> | The syntax node to insert after (this always contains a reference to the original syntax node) |

#### Returns

`void`

#### Defined in

[providers/GuardClauseProvider.ts:103](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/GuardClauseProvider.ts#L103)

___

### insertSyntaxNodeBefore

▸ **insertSyntaxNodeBefore**(`document`, `edit`, `node`, `before`): `void`

Insert the given syntax node before the specified `before` syntax node.
This is usually an if statement used as a guard clause.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `document` | `TextDocument` | The document in which to add the condition |
| `edit` | `TextEditorEdit` | The edit builder to use to add the condition |
| `node` | [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\> | The syntax node to insert (this may not contain any references and could need to be rebuilt) |
| `before` | [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\> | The syntax node to insert before (this always contains a reference to the original syntax node) |

#### Returns

`void`

#### Defined in

[providers/GuardClauseProvider.ts:88](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/GuardClauseProvider.ts#L88)

___

### prependSyntaxNode

▸ **prependSyntaxNode**(`document`, `edit`, `node`, `root`): `void`

Prepend the given syntax node to the root syntax node specified.
This is usually an if statement used as a guard clause.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `document` | `TextDocument` | The document in which to add the condition |
| `edit` | `TextEditorEdit` | The edit builder to use to add the condition |
| `node` | [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\> | The syntax node to prepend (this may not contain any references and could need to be rebuilt) |
| `root` | [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\> | The root syntax node to prepend to (this always contains a reference to the original syntax node) |

#### Returns

`void`

#### Defined in

[providers/GuardClauseProvider.ts:58](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/GuardClauseProvider.ts#L58)

___

### provideConditions

▸ **provideConditions**(`document`, `range?`): `ProviderResult`<[`RefSyntaxNode`](RefSyntaxNode.md)<`T`\> & [`ExpressionContext`](ExpressionContext.md)<`T`\>[]\>

Provide conditions for the given document and range.
Only top-level conditions should be returned.

**`Example`**

```typescript
// Given the following code:
if ((a && b) || c) {
  d();
  if (e) f();
}

// The following conditions should be returned:
(a && b || c9
e
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `document` | `TextDocument` | The document for which to provide conditions |
| `range?` | `Range` | The range for which to provide conditions |

#### Returns

`ProviderResult`<[`RefSyntaxNode`](RefSyntaxNode.md)<`T`\> & [`ExpressionContext`](ExpressionContext.md)<`T`\>[]\>

A list of conditions with references to the original syntax nodes.
        These must include additional information about the context in which the condition is used.

#### Overrides

[InvertConditionProvider](InvertConditionProvider.md).[provideConditions](InvertConditionProvider.md#provideconditions)

#### Defined in

[providers/GuardClauseProvider.ts:32](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/GuardClauseProvider.ts#L32)

___

### removeCondition

▸ **removeCondition**(`document`, `edit`, `condition`): `void`

Remove the given condition from the given document.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `document` | `TextDocument` | The document in which to remove the condition |
| `edit` | `TextEditorEdit` | The edit builder to use to remove the condition |
| `condition` | [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\> & [`ExpressionContext`](ExpressionContext.md)<`T`\> | The condition to remove (this always contains a reference to the original syntax node) |

#### Returns

`void`

#### Defined in

[providers/GuardClauseProvider.ts:44](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/GuardClauseProvider.ts#L44)

___

### replaceCondition

▸ **replaceCondition**(`document`, `edit`, `original`, `replace`): `void`

Replace the given condition with a new condition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `document` | `TextDocument` | The document in which to replace the condition |
| `edit` | `TextEditorEdit` | The edit builder to use to replace the condition |
| `original` | [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\> | The condition to replace (this always contains a reference to the original syntax node) |
| `replace` | [`UpdatedSyntaxNode`](UpdatedSyntaxNode.md)<`T`\> | The new condition (this may not contain any references and could need to be rebuilt) |

#### Returns

`void`

#### Inherited from

[InvertConditionProvider](InvertConditionProvider.md).[replaceCondition](InvertConditionProvider.md#replacecondition)

#### Defined in

[providers/InvertConditionProvider.ts:46](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertConditionProvider.ts#L46)

___

### resolveCondition

▸ `Optional` **resolveCondition**(`condition`): `ProviderResult`<[`RefSyntaxNode`](RefSyntaxNode.md)<`T`\> & [`ExpressionContext`](ExpressionContext.md)<`T`\>\>

Resolve additional information for the given condition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `condition` | [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\> & [`ExpressionContext`](ExpressionContext.md)<`T`\> | The condition for which to resolve additional information |

#### Returns

`ProviderResult`<[`RefSyntaxNode`](RefSyntaxNode.md)<`T`\> & [`ExpressionContext`](ExpressionContext.md)<`T`\>\>

The condition with additional information (e.g. the condition's name)

#### Overrides

[InvertConditionProvider](InvertConditionProvider.md).[resolveCondition](InvertConditionProvider.md#resolvecondition)

#### Defined in

[providers/GuardClauseProvider.ts:33](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/GuardClauseProvider.ts#L33)
