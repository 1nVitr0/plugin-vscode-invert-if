# Contributing to `invert if`

## Language Support Extensions

You can contribute to `invert if` by providing language support for other languages through extensions, that register themselves with the base extension `1nVitr0.invert-if`.
The API is defined in the package [vscode-invert-if](https://www.npmjs.com/package/vscode-invert-if).
Partial language support is possible by [registering](#provider-registration) providers for any of:

- Conditions
- If statements
- Guard clauses
- Embedded Code Sections

### Setup

To get started, you can initialize your own extension for Visual Studio Code.
To get typing support for the API as well as use included helper functions, you will need to install [vscode-invert-if](https://www.npmjs.com/package/vscode-invert-if):

```shell
npm install --save vscode-invert-if
```

### Condition providers

Condition providers must implement the following interface:

```typescript
interface InvertConditionProvider<T> {
  provideConditions(
    document: TextDocument,
    range?: Range
  ): ProviderResult<RefSyntaxNode<T>[]>;
  resolveCondition?(
    condition: RefSyntaxNode<T>
  ): ProviderResult<RefSyntaxNode<T>>;

  replaceCondition(
    context: DocumentContext,
    edit: TextEditorEdit,
    original: RefSyntaxNode<T>,
    replace: UpdatedSyntaxNode<T>
  ): void;
}
```

### If Else Provider

If Else providers must implement the following interface:

```typescript
interface InvertIfElseProvider<T> {
  provideIfStatements(
    document: TextDocument,
    range?: Range
  ): ProviderResult<IfStatementRefNode<T>[]>;
  resolveIfStatement?(
    statement: IfStatementRefNode<T>
  ): ProviderResult<IfStatementRefNode<T>>;

  replaceIfStatement(
    context: DocumentContext,
    edit: TextEditorEdit,
    original: IfStatementRefNode<T>,
    replace: IfStatementUpdatedNode<T>
  ): void;
}
```

### Guard Clause Provider

Guard Clause providers must implement the following interface, that extends most of the methods from `InvertConditionProvider`:

```typescript
export interface GuardClauseProvider<T> extends InvertConditionProvider<T> {
  provideConditions(
    document: TextDocument,
    range?: Range
  ): ProviderResult<(RefSyntaxNode<T> & ExpressionContext<T>)[]>;
  resolveCondition?(
    condition: RefSyntaxNode<T> & ExpressionContext<T>
  ): ProviderResult<RefSyntaxNode<T> & ExpressionContext<T>>;

  removeCondition(
    context: DocumentContext,
    edit: TextEditorEdit,
    condition: RefSyntaxNode<T> & ExpressionContext<T>
  ): void;
  prependSyntaxNode(
    context: DocumentContext,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<T>,
    root: RefSyntaxNode<T>
  ): void;
  appendSyntaxNode(
    context: DocumentContext,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<T>,
    root: RefSyntaxNode<T>
  ): void;
  insertSyntaxNodeBefore(
    context: DocumentContext,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<T>,
    before: RefSyntaxNode<T>
  ): void;
  insertSyntaxNodeAfter(
    context: DocumentContext,
    edit: TextEditorEdit,
    node: UpdatedSyntaxNode<T>,
    after: RefSyntaxNode<T>
  ): void;
}
```

## Embedded Language Providers

Embedded Language Providers must implement the following interface:

```typescript
export interface EmbeddedLanguageProvider {
  provideEmbeddedSections(
    context: DocumentContext,
    range?: Range
  ): ProviderResult<EmbeddedLanguageSection[]>;
}
```

### Provider Registration

The base extension offers a [registration API](https://1nvitr0.github.io/plugin-vscode-invert-if/interfaces/InvertIfBaseProvider.html) in the form of:

```typescript
interface InvertIfBaseProvider {
  registerGuardClauseProvider<T>(provider: GuardClauseProvider<T>, documentSelector: DocumentSelector): void;
  registerConditionProvider<T>(provider: InvertConditionProvider<T>, documentSelector: DocumentSelector): void;
  registerIfElseProvider<T>(provider: InvertIfElseProvider<T>, documentSelector: DocumentSelector): void;
  registerEmbeddedLanguageProvider(provider: EmbeddedLanguageProvider, documentSelector: DocumentSelector): void;

  unregisterGuardClauseProvider<T>(provider: GuardClauseProvider<T>, documentSelector: DocumentSelector): void;
  unregisterConditionProvider<T>(provider: InvertConditionProvider<T>, documentSelector: DocumentSelector): void;
  unregisterIfElseProvider<T>(provider: InvertIfElseProvider<T>, documentSelector: DocumentSelector): void;
  unregisterEmbeddedLanguageProvider(provider: EmbeddedLanguageProvider): void;

  onRegisterProvider: Event<Plugin<any>>;
  onUnregisterProvider: Event<Plugin<any>>;
}
```

A fully featured provider can register all its components using this API:

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

For a practical example, see the [provider](https://github.com/1nVitr0/plugin-vscode-invert-if/tree/main/packages/lang-support-js) for `JavaScript` and `TypeScript` language support, that is shipped with the extension.

### Activation Event

In order to minimize the impact on VS Codes loading time, the Invert If extension runs a dummy command when it's ready to accept plugin registrations `invertIf.loadPlugins`.
Instead of using `*` as an activation event, consider using `onCommand:invertIf.loadPlugins`:

```json
{
  "activationEvents": [
    "onCommand:invertIf.loadPlugins"
  ]
}
```
