# Invert If

[![Build Status](https://img.shields.io/github/workflow/status/1nVitr0/plugin-vscode-invert-if/Release)](https://github.com/1nVitr0/plugin-vscode-invert-if/actions/workflows/release.yml)
[![Main Test Status](https://img.shields.io/github/workflow/status/1nVitr0/plugin-vscode-invert-if/Tests?label=tests)](https://github.com/1nVitr0/plugin-vscode-invert-if/actions/workflows/test.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)<br>
[![Visual Studio Code extension 1nVitr0.invert-if](https://vsmarketplacebadge.apphb.com/version/1nVitr0.invert-if.svg)](https://marketplace.visualstudio.com/items?itemName=1nVitr0.invert-if)
[![Installs for Visual Studio Code extension 1nVitr0.invert-if](https://vsmarketplacebadge.apphb.com/installs/1nVitr0.invert-if.svg)](https://marketplace.visualstudio.com/items?itemName=1nVitr0.invert-if)
[![Rating for Visual Studio Code extension 1nVitr0.invert-if](https://vsmarketplacebadge.apphb.com/rating/1nVitr0.invert-if.svg)](https://marketplace.visualstudio.com/items?itemName=1nVitr0.invert-if)


![Demo of Extension](resources/demo.gif)

This is a preview for the `invert-if` Extension that allows you to quickly and easily **invert if blocks**, **invert conditions** and **create guard clauses**. 

- [Features](#features)
  - [Commands](#commands)
- [Language Support](#language-support)
- [Extension Settings](#extension-settings)
- [Known Issues](#known-issues)
- [Contributing](#contributing)

## Features

While still in active development, the following features are already available:

### Commands

- `Invert If: Invert If Block` Inverts if / else blocks
- `Invert If: Create Guard Clause from Condition` Creates guard clause for the selected Condition
- `Invert If: Create Custom Guard Clause from Condition` Creates guard clause for the selected Condition with custom options
- `Invert If: Invert Condition` Invert selected edition

The selection is currently only the condition under the active cursors, but more fine grained control will be available. The commands take into account **all** cursors, so **multiple selections** are possible.

## Language Support

Currently only the following languages are supported. I plan to add more but I need to find a way without bloating the extension with too many AST parsers / generators:

- `javascript`
- `typescript`

## Extension Settings

The extension settings are currently not exported

## Known Issues

There are most likely a few Bugs, but the tests are in the process of being expanded.

## Contributing

There are currently no feature contributions required, but when you encounter an error or weird behavior feel free to open an issue. I still need a lot of test data to provide solid fixtures for all edge cases.