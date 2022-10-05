[vscode-invert-if](../README.md) / [Exports](../modules.md) / InvertConditionProvider

# Interface: InvertConditionProvider<T\>

A provider that can be registered to handle the inversion of conditions.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- **`InvertConditionProvider`**

  ↳ [`GuardClauseProvider`](GuardClauseProvider.md)

## Table of contents

### Methods

- [provideConditions](InvertConditionProvider.md#provideconditions)
- [replaceCondition](InvertConditionProvider.md#replacecondition)
- [resolveCondition](InvertConditionProvider.md#resolvecondition)

## Methods

### provideConditions

▸ **provideConditions**(`document`, `range?`): `ProviderResult`<[`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>[]\>

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

`ProviderResult`<[`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>[]\>

A list of conditions with references to the original syntax nodes

#### Defined in

[providers/InvertConditionProvider.ts:29](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertConditionProvider.ts#L29)

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

#### Defined in

[providers/InvertConditionProvider.ts:46](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertConditionProvider.ts#L46)

___

### resolveCondition

▸ `Optional` **resolveCondition**(`condition`): `ProviderResult`<[`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>\>

Resolve additional information for the given condition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `condition` | [`RefSyntaxNode`](RefSyntaxNode.md)<`T`\> | The condition for which to resolve additional information |

#### Returns

`ProviderResult`<[`RefSyntaxNode`](RefSyntaxNode.md)<`T`\>\>

The condition with additional information (e.g. the condition's name)

#### Defined in

[providers/InvertConditionProvider.ts:36](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertConditionProvider.ts#L36)
