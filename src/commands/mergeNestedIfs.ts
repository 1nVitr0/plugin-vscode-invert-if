import { Range, TextEditor, TextEditorEdit, window } from 'vscode';
import { service } from '../injections';
import { IfStatementKind, FileKind } from 'ast-types/gen/kinds';
import { NodePath } from 'ast-types/lib/node-path';

/**
 * @title Invert If: Merge selected if blocks
 * @shortTitle Merge if blocks
 * @command invertIf.mergeNestedIfs
 */
export default function mergeNestedIfs(editor: TextEditor, editBuilder: TextEditorEdit, selection?: Range) {
  const selections = selection ? [selection] : editor.selections;

  let program: FileKind;
  try {
    program = service.ast.parseDocument(editor.document);
  } catch (e: any) {
    return window.showErrorMessage(service.lang.errorMessage('parseError', e.description));
  }

  const ifBlocks = selections
    .reduce<NodePath<IfStatementKind>[]>(
      (blocks, selection) => [...blocks, ...service.ast.extractIfBlocks(program, selection, 1)],
      []
    )
    .map(({ node }) => node)
    .sort((a, b) => (service.ast.isParentOf(a, b) ? -1 : 1));

  const parent = ifBlocks.shift();
  if (!parent) return window.showErrorMessage(service.lang.errorMessage('noIfBlock'));

  const merged = service.ifElse.combine(parent, ...ifBlocks);

  service.ast.applyASTChanges(editor.document, editBuilder, merged);
}
