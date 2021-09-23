import { Range, TextEditor, TextEditorEdit } from 'vscode';
import { service } from '../injections';
import ASTService from '../services/ASTService';

export default function invertIfElse(editor: TextEditor, editBuilder: TextEditorEdit, selection?: Range) {
  const program = service.ast.parseDocument(editor.document);
  const ifBlock = service.ifElseInversion.extractIfBlocks(program, selection, 1).pop();

  if (!ifBlock || !ifBlock.loc) return;

  const inverse = service.ifElseInversion.inverse(ifBlock);
  editBuilder.replace(ASTService.nodeRange(ifBlock), service.ast.stringify(inverse, editor.document.languageId));
}
