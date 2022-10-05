[vscode-invert-if](../README.md) / [Exports](../modules.md) / InvertIfBaseProvider

# Interface: InvertIfBaseProvider

The interface that is provided by the `1nVitr0.invert-if` extension.

**`Example`**

Example usage in an extension adding language support for JavaScript:
```typescript
import { InvertIfBaseProvider } from "vscode-invert-if";

export function activate(context: ExtensionContext) {
  const invertIfExtension = extensions.getExtension<InvertIfBaseProvider>("1nVitr0.invert-if");

  if (invertIfExtension) {
    invertIf = invertIfExtension.exports;
    provider = new JavaScriptInvertIfProvider();

    invertIf.registerConditionProvider(provider, documentFilter);
    invertIf.registerIfElseProvider(provider, documentFilter);
    invertIf.registerGuardClauseProvider(provider, documentFilter);
  }
}
```

## Table of contents

### Properties

- [onRegisterProvider](InvertIfBaseProvider.md#onregisterprovider)
- [onUnregisterProvider](InvertIfBaseProvider.md#onunregisterprovider)

### Methods

- [registerConditionProvider](InvertIfBaseProvider.md#registerconditionprovider)
- [registerGuardClauseProvider](InvertIfBaseProvider.md#registerguardclauseprovider)
- [registerIfElseProvider](InvertIfBaseProvider.md#registerifelseprovider)
- [unregisterConditionProvider](InvertIfBaseProvider.md#unregisterconditionprovider)
- [unregisterGuardClauseProvider](InvertIfBaseProvider.md#unregisterguardclauseprovider)
- [unregisterIfElseProvider](InvertIfBaseProvider.md#unregisterifelseprovider)

## Properties

### onRegisterProvider

• **onRegisterProvider**: `Event`<[`Plugin`](Plugin.md)<`any`, [`InvertConditionProvider`](InvertConditionProvider.md)<`any`\> \| [`InvertIfElseProvider`](InvertIfElseProvider.md)<`any`\> \| [`GuardClauseProvider`](GuardClauseProvider.md)<`any`\>\>\>

Register an Event listener that is called when a plugin is registered.

#### Defined in

[providers/InvertIfBaseProvider.ts:85](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertIfBaseProvider.ts#L85)

___

### onUnregisterProvider

• **onUnregisterProvider**: `Event`<[`Plugin`](Plugin.md)<`any`, [`InvertConditionProvider`](InvertConditionProvider.md)<`any`\> \| [`InvertIfElseProvider`](InvertIfElseProvider.md)<`any`\> \| [`GuardClauseProvider`](GuardClauseProvider.md)<`any`\>\>\>

Register an Event listener that is called when a plugin is unregistered.

#### Defined in

[providers/InvertIfBaseProvider.ts:89](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertIfBaseProvider.ts#L89)

## Methods

### registerConditionProvider

▸ **registerConditionProvider**<`T`\>(`provider`, `documentSelector`): `void`

Register a new provider, which can handle the inversion of conditions.
It is recommended to register your provider for each type,
to prevent conflicts with other extensions.

Your extension should call `unregisterConditionProvider` in `deactivate`.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | [`InvertConditionProvider`](InvertConditionProvider.md)<`T`\> | The provider that will be used to invert conditions. |
| `documentSelector` | `DocumentSelector` | The document selector that selects for languages supported by your extension. |

#### Returns

`void`

#### Defined in

[providers/InvertIfBaseProvider.ts:39](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertIfBaseProvider.ts#L39)

___

### registerGuardClauseProvider

▸ **registerGuardClauseProvider**<`T`\>(`provider`, `documentSelector`): `void`

Register a new provider, which can handle the creation of guard clauses.
It is recommended to register your provider for each type,
to prevent conflicts with other extensions.

Your extension should call `unregisterGuardClauseProvider` in `deactivate`.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | [`GuardClauseProvider`](GuardClauseProvider.md)<`T`\> | The provider that will be used to create guard clauses. |
| `documentSelector` | `DocumentSelector` | The document selector that selects for languages supported by your extension. |

#### Returns

`void`

#### Defined in

[providers/InvertIfBaseProvider.ts:61](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertIfBaseProvider.ts#L61)

___

### registerIfElseProvider

▸ **registerIfElseProvider**<`T`\>(`provider`, `documentSelector`): `void`

Register a new provider, which can handle the inversion of if-else statements.
It is recommended to register your provider for each type,
to prevent conflicts with other extensions.

Your extension should call `unregisterIfElseProvider` in `deactivate`.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | [`InvertIfElseProvider`](InvertIfElseProvider.md)<`T`\> | The provider that will be used to invert if-else statements. |
| `documentSelector` | `DocumentSelector` | The document selector that selects for languages supported by your extension. |

#### Returns

`void`

#### Defined in

[providers/InvertIfBaseProvider.ts:50](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertIfBaseProvider.ts#L50)

___

### unregisterConditionProvider

▸ **unregisterConditionProvider**<`T`\>(`provider`): `void`

Unregister a provider, which can handle the inversion of if-else statements.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | [`InvertConditionProvider`](InvertConditionProvider.md)<`T`\> | The provider that will be unregistered. |

#### Returns

`void`

#### Defined in

[providers/InvertIfBaseProvider.ts:74](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertIfBaseProvider.ts#L74)

___

### unregisterGuardClauseProvider

▸ **unregisterGuardClauseProvider**<`T`\>(`provider`): `void`

Unregister a provider, which can handle the inversion of conditions.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | [`GuardClauseProvider`](GuardClauseProvider.md)<`T`\> | The provider that will be unregistered. |

#### Returns

`void`

#### Defined in

[providers/InvertIfBaseProvider.ts:68](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertIfBaseProvider.ts#L68)

___

### unregisterIfElseProvider

▸ **unregisterIfElseProvider**<`T`\>(`provider`): `void`

Unregister a provider, which can handle the creation of guard clauses.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | [`InvertIfElseProvider`](InvertIfElseProvider.md)<`T`\> | The provider that will be unregistered. |

#### Returns

`void`

#### Defined in

[providers/InvertIfBaseProvider.ts:80](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/providers/InvertIfBaseProvider.ts#L80)
