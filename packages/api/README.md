# Visual Studio Code `Invert If` API

![Demo of Extension](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/main/packages/extension/resources/demo.gif?raw=true)

This package includes the API for extensions interacting with the extension [Invert If](https://marketplace.visualstudio.com/items?itemName=1nVitr0.invert-if) for Visual Studio Code.

For the full documentation refer to the [Type Definitions](https://github.com/1nVitr0/plugin-vscode-invert-if/tree/main/packages/api/docs/modules.md) or to the [Contributing Guidelines](https://github.com/1nVitr0/plugin-vscode-invert-if/tree/main/packages/extension/CONTRIBUTING.md).

## Basic usage

```typescript
import { extensions } from "vscode";
import { InvertIfBaseProvider } from "vscode-invert-if";

const invertIfExtension = extensions.getExtension<InvertIfBaseProvider>("1nVitr0.invert-if");
const provider = new YourLanguageSupportProvider();

if (invertIfExtension) {
  const invertIf = invertIfExtension.exports;

  invertIf.registerConditionProvider(provider, documentFilter);
  invertIf.registerIfElseProvider(provider, documentFilter);
  invertIf.registerGuardClauseProvider(provider, documentFilter);
}
```
