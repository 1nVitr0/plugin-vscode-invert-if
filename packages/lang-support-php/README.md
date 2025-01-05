# `Invert If` Language support for language `PHP`

This extension includes `PHP` for the (Invert If)[https://marketplace.visualstudio.com/items?itemName=1nVitr0.invert-if] Visual Studio Code extension.

It is in very early alpha and depends on an outdated PHP generator. Expect some bugs and non-functioning commands.

## Known Issues

- The generator does **NOT** respect logical operator precedence:
  - `(a || b) && c` will be generated as `a || b && c`, which is the same as `a || (b && c)`
