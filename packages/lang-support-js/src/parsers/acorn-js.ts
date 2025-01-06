import { NodeKind } from "ast-types/lib/gen/kinds";

/**
 * From: https://github.com/benjamn/recast/blob/26f21ab437f8fb657057e6e5249a79f67b5052ff/parsers/babel-ts.ts
 * Combined with: https://github.com/coderaiser/putout/blob/b64b6aff18058d63e77c8455f79704a4330bc5fc/packages/engine-parser/lib/parsers/acorn.js#L25-L31
 *
 * Thanks to @coderaiser for the esprima token fix.
 */
export const parse = ((source: string, options?: any) => {
  const parser = require("acorn");

  const comments: any[] = [];
  const tokens = Array.from(parser.tokenizer(source, options));

  const ast = parser.parse(source, {
    locations: true,
    allowHashBang: true,
    allowImportExportEverywhere: true,
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    ecmaVersion: 2020,
    sourceType: "module",
    onComment: comments,
    onToken: tokens,
  });

  if (!ast.comments) {
    ast.comments = comments;
  }

  if (!ast.tokens) {
    ast.tokens = tokens;
  }

  return ast;
}) as () => NodeKind;
