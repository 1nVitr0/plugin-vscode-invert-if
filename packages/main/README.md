# Invert If

[![Build Status](https://img.shields.io/github/workflow/status/1nVitr0/plugin-vscode-invert-if/Release)](https://github.com/1nVitr0/plugin-vscode-invert-if/actions/workflows/release.yml)
[![Test Status](https://img.shields.io/github/workflow/status/1nVitr0/plugin-vscode-invert-if/Tests?label=tests)](https://github.com/1nVitr0/plugin-vscode-invert-if/actions/workflows/test.yml)
[![Minimum Coverage](https://img.shields.io/nycrc/1nVitr0/plugin-vscode-invert-if?config=.nycrc.json&preferredThreshold=lines)](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/main/.nycrc.json)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)<br>
[![Visual Studio Code extension 1nVitr0.invert-if](https://vsmarketplacebadge.apphb.com/version/1nVitr0.invert-if.svg)](https://marketplace.visualstudio.com/items?itemName=1nVitr0.invert-if)
[![Installs for Visual Studio Code extension 1nVitr0.invert-if](https://vsmarketplacebadge.apphb.com/installs/1nVitr0.invert-if.svg)](https://marketplace.visualstudio.com/items?itemName=1nVitr0.invert-if)
[![Rating for Visual Studio Code extension 1nVitr0.invert-if](https://vsmarketplacebadge.apphb.com/rating/1nVitr0.invert-if.svg)](https://marketplace.visualstudio.com/items?itemName=1nVitr0.invert-if)


![Demo of Extension](packages/main/resources/demo.gif)

This is a preview for the `invert-if` Extension that allows you to quickly and easily **invert if blocks**, **merge nested if blocks**, **invert conditions** and **create guard clauses**.  It also provides the option to **generate truth tables** to verify update if conditions.

- [Features](#features)
  - [Commands](#commands)
    - [Truth Tables](#truth-tables)
- [Language Support](#language-support)
- [Extension Settings](#extension-settings)
- [Known Issues](#known-issues)
- [Contributing](#contributing)

## Features

While still in active development, the following features are already available:

### Commands

- `Invert If: Invert If Block` Inverts if / else blocks
- `Invert If: Merge selected if blocks` Merge selected if / else blocks into a single if block (concatenating the conditions using `&&`)
- `Invert If: Create Guard Clause from Condition` Creates guard clause for the selected Condition
- `Invert If: Create Custom Guard Clause from Condition` Creates guard clause for the selected Condition with custom options
- `Invert If: Invert Condition` Invert selected edition
- `Invert If: Generate truth table` Generate truth tables for the selected conditions
- `Invert If: Invert Condition and compare truth tables` Invert selected editions and show their truth tables

The selection is currently only the condition under the active cursors, but more fine grained control will be available. The commands take into account **all** cursors, so **multiple selections** are possible.

#### Truth Tables

Truth tables can be used to compare or analyze if conditions as well as verify the inversion process of the extension. They are currently provided using a temporary `markdown` document:

```markdown
(1) `a > b || c == d && e !== f`
(2) `a <= b && (c != d || e === f)`

| a > b | c == d | e === f | (1)   | (2)   |
| ----- | ------ | ------- | ----- | ----- |
| false | false  | false   | false | true  |
| false | false  | true    | true  | false |
| false | true   | false   | false | true  |
| false | true   | true    | true  | false |
| true  | false  | false   | true  | false |
| true  | false  | true    | true  | false |
| true  | true   | false   | true  | false |
| true  | true   | true    | true  | false |
```

To make it possible for tables to be compared, some operators are flipped to their simplest version, e.g. `!==` to `==` or `<=` to `>`.

## Language Support

Currently only the following languages are supported. I plan to add more but I need to find a way without bloating the extension with too many AST parsers / generators:

- `javascript`
- `typescript`

You can add additional language support by providing an [extension](packages/main/CONTRIBUTING.md) that registers itself with `Invert If`.

## Extension Settings

The extension settings are currently not exported

## Known Issues

- `TypeScript` AST tree seems to be a bit unstable, which can lead to inconsistent inversion

There are most likely a few more Bugs, but the tests are in the process of being expanded.

## Contributing

There are currently no feature contributions required, but when you encounter an error or weird behavior feel free to open an issue. I still need a lot of test data to provide solid fixtures for all edge cases.

You can also add additional language support by providing an [extension](packages/main/CONTRIBUTING.md) that registers itself with `Invert If`.
