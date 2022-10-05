[vscode-invert-if](../README.md) / [Exports](../modules.md) / InvertIfElseProvider

# Interface: InvertIfElseProvider<T\>

A provider that can be registered to handle the inversion of if-else statements.

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Methods

- [provideIfStatements](InvertIfElseProvider.md#provideifstatements)
- [replaceIfStatement](InvertIfElseProvider.md#replaceifstatement)
- [resolveIfStatement](InvertIfElseProvider.md#resolveifstatement)

## Methods

### provideIfStatements

▸ **provideIfStatements**(`document`, `range?`): `ProviderResult`<[`IfStatementRefNode`](IfStatementRefNode.md)<`T`\>[]\>

Provide if-else statements for the given document and range.

**`Example`**

```typescript
// Given the following code:
if (a) {
  b();
} else  if(c){
  d();
  if (e) f();
}

// The following if-else statements should be returned:
if (a) b() {...}
if (e) f() {...}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `document` | `TextDocument` | The document for which to provide if-else statements |
| `range?` | `Range` | The range for which to provide if-else statements |

#### Returns

`ProviderResult`<[`IfStatementRefNode`](IfStatementRefNode.md)<`T`\>[]\>

A list of if-else statements with references to the original syntax nodes

#### Defined in

[providers/InvertIfElseProvider.ts:30](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertIfElseProvider.ts#L30)

___

### replaceIfStatement

▸ **replaceIfStatement**(`document`, `edit`, `original`, `replace`): `void`

Replace the given if-else statement with a new if-else statement.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `document` | `TextDocument` | The document in which to replace the if-else statement |
| `edit` | `TextEditorEdit` | The edit builder to use to replace the if-else statement |
| `original` | [`IfStatementRefNode`](IfStatementRefNode.md)<`T`\> | The if-else statement to replace (this always contains a reference to the original syntax node) |
| `replace` | [`IfStatementUpdatedNode`](IfStatementUpdatedNode.md)<`T`\> | The new if-else statement (this may not contain any references and could need to be rebuilt) |

#### Returns

`void`

#### Defined in

[providers/InvertIfElseProvider.ts:47](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertIfElseProvider.ts#L47)

___

### resolveIfStatement

▸ `Optional` **resolveIfStatement**(`statement`): `ProviderResult`<[`IfStatementRefNode`](IfStatementRefNode.md)<`T`\>\>

Resolve additional information for the given if-else statement.

#### Parameters

| Name | Type |
| :------ | :------ |
| `statement` | [`IfStatementRefNode`](IfStatementRefNode.md)<`T`\> |

#### Returns

`ProviderResult`<[`IfStatementRefNode`](IfStatementRefNode.md)<`T`\>\>

The if-else statement with additional information (e.g. the if-else statement's name)

#### Defined in

[providers/InvertIfElseProvider.ts:37](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertIfElseProvider.ts#L37)
