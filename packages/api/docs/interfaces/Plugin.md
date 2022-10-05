[vscode-invert-if](../README.md) / [Exports](../modules.md) / Plugin

# Interface: Plugin<T, P\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `P` | extends [`InvertConditionProvider`](InvertConditionProvider.md)<`T`\> \| [`InvertIfElseProvider`](InvertIfElseProvider.md)<`T`\> \| [`GuardClauseProvider`](GuardClauseProvider.md)<`T`\> = [`InvertConditionProvider`](InvertConditionProvider.md)<`T`\> \| [`InvertIfElseProvider`](InvertIfElseProvider.md)<`T`\> \| [`GuardClauseProvider`](GuardClauseProvider.md)<`T`\> |

## Table of contents

### Properties

- [capabilities](Plugin.md#capabilities)
- [documentSelector](Plugin.md#documentselector)
- [provider](Plugin.md#provider)

## Properties

### capabilities

• **capabilities**: { `guardClause?`: `boolean` ; `invertCondition?`: `boolean` ; `invertIfElse?`: `boolean`  } & `P` extends [`InvertConditionProvider`](InvertConditionProvider.md)<`T`\> ? { `invertCondition`: ``true``  } : {} & `P` extends [`InvertIfElseProvider`](InvertIfElseProvider.md)<`T`\> ? { `invertIfelse`: ``true``  } : {} & `P` extends [`GuardClauseProvider`](GuardClauseProvider.md)<`T`\> ? { `guardClause`: ``true``  } : {}

#### Defined in

[context/Plugin.ts:14](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/context/Plugin.ts#L14)

___

### documentSelector

• **documentSelector**: `DocumentSelector`

#### Defined in

[context/Plugin.ts:13](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/context/Plugin.ts#L13)

___

### provider

• **provider**: `P`

#### Defined in

[context/Plugin.ts:21](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/context/Plugin.ts#L21)
