import {
  ProgramKind,
  IfStatementKind,
  StatementKind,
  ExpressionKind,
  ExpressionStatementKind,
} from 'ast-types/gen/kinds';
import { expect } from 'chai';
import { commands, Range, window, workspace, TextEditorEdit } from 'vscode';
import ASTService from '../../../services/ASTService';
import ConfigurationService from '../../../services/ConfigurationService';

suite('Unit tests for ASTService', () => {
  let configurationService: ConfigurationService;
  let astService: ASTService;

  const testCode = 'if (a == b && c <= d) {}';
  const testCodeNode = {
    type: 'Program',
    body: [
      {
        type: 'IfStatement',
        test: {
          type: 'LogicalExpression',
          operator: '&&',
          left: {
            type: 'BinaryExpression',
            operator: '==',
            left: { type: 'Identifier', name: 'a' },
            right: { type: 'Identifier', name: 'b' },
          },
          right: {
            type: 'BinaryExpression',
            operator: '<=',
            left: { type: 'Identifier', name: 'c' },
            right: { type: 'Identifier', name: 'd' },
          },
        },
        consequent: { type: 'BlockStatement', body: [] },
        alternate: null,
      },
    ],
    sourceType: 'script',
    errors: [],
  };
  const testCodeRangeNode = {
    type: 'Program',
    body: [
      {
        expression: {
          name: 'a',
          type: 'Identifier',
        },
        type: 'ExpressionStatement',
      },
    ],
    errors: [],
    sourceType: 'script',
  };
  const parentCode = 'if (a) { b }';
  const indentationCode = '    if (a) { b }';
  const testIfCode = 'if (a) { b }\nif (c) { d }';
  const testDeepIfCode = 'if (a) { } else { if (b) { c } }';
  const testReplaceCode = 'if (a1) { b1 }\nif (c1) { d1 }';

  suiteSetup(() => {
    configurationService = new ConfigurationService();
    astService = new ASTService(configurationService);
  });

  test('parses valid js Code', () => {
    const node = astService.parse(testCode, 'js');
    const program: ProgramKind & { errors?: any[] } = node.program;
    const stripped = astService.stripAttributes(program);

    expect(!!('errors' in stripped && stripped.errors?.length)).to.be.false;
    expect(stripped).to.deep.equal(testCodeNode);
  });

  test('parses document', async () => {
    const document = await workspace.openTextDocument({ language: 'js', content: testCode });
    const node = astService.parseDocument(document);
    const program: ProgramKind & { errors?: any[] } = node.program;
    const stripped = astService.stripAttributes(program);

    expect(stripped).to.deep.equal(testCodeNode);

    // Close document
    await window.showTextDocument(document).then(() => {
      return commands.executeCommand('workbench.action.closeActiveEditor');
    });
  });

  test('parses document range', async () => {
    const document = await workspace.openTextDocument({ language: 'js', content: testCode });
    const node = astService.parseDocumentRange(document, new Range(0, 4, 0, 5));
    const program: ProgramKind & { errors?: any[] } = node.program;
    const stripped = astService.stripAttributes(program);

    expect(stripped).to.deep.equal(testCodeRangeNode);

    // Close document
    await window.showTextDocument(document).then(() => {
      return commands.executeCommand('workbench.action.closeActiveEditor');
    });
  });

  test('generates valid js Code', () => {
    const node = astService.parse(testCode, 'js');
    const code = astService.stringify(node, 'js');
    expect(code).to.equal(testCode);
  });

  test('gets node range', () => {
    const node = astService.parse(testCode, 'js');
    const range = astService.nodeRange(node);

    expect(range.start.line).to.equal(0);
    expect(range.start.character).to.equal(0);
    expect(range.end.line).to.equal(0);
    expect(range.end.character).to.equal(24);
  });

  test('returns empty range when no loc', () => {
    const node = astService.parse(testCode, 'js');
    delete node.loc;
    const range = astService.nodeRange(node);

    expect(range.isEmpty).to.be.true;
  });

  test('node detects intersects range', () => {
    const node = astService.parse(testCode, 'js');
    expect(astService.nodeIntersectsRange(node, new Range(0, 10, 1, 10))).to.be.true;
  });

  test('node detects non intersecting range', () => {
    const node = astService.parse(testCode, 'js');
    expect(astService.nodeIntersectsRange(node, new Range(1, 0, 1, 10))).to.be.false;
  });

  test('node detects contains range', () => {
    const node = astService.parse(testCode, 'js');
    expect(astService.nodeContainsRange(node, new Range(0, 0, 0, 10))).to.be.true;
  });

  test('node detects contains range when equal', () => {
    const node = astService.parse(testCode, 'js');
    expect(astService.nodeContainsRange(node, new Range(0, 0, 0, 24))).to.be.true;
  });

  test('node detects non contained but intersecting range', () => {
    const node = astService.parse(testCode, 'js');
    expect(astService.nodeContainsRange(node, new Range(0, 0, 1, 10))).to.be.false;
  });

  test('node detects non contained range', () => {
    const node = astService.parse(testCode, 'js');
    expect(astService.nodeContainsRange(node, new Range(1, 0, 1, 10))).to.be.false;
  });

  test('node detects parent node', () => {
    const node = astService.parse(parentCode, 'js');
    const child = (node.program.body[0] as IfStatementKind).test;
    expect(astService.isParentOf(node, child)).to.be.true;
    expect(astService.isParentOf(child, node)).to.be.false;
  });

  test('detect node indentation', async () => {
    const node = astService.parse(indentationCode, 'js');
    const document = await workspace.openTextDocument({ language: 'js', content: indentationCode });

    expect(astService.nodeIndentation(node, document).length).to.equal(4);

    // Close document
    await window.showTextDocument(document).then(() => {
      return commands.executeCommand('workbench.action.closeActiveEditor');
    });
  });

  test('applies ast changes', async () => {
    const replace = astService.parse(testReplaceCode, 'js');
    const document = await workspace.openTextDocument({ language: 'js', content: testIfCode });

    const editor = await window.showTextDocument(document);
    await editor.edit((editBuilder) =>
      astService.applyASTChanges(
        document,
        editBuilder,
        replace.program.body[0] as StatementKind,
        (replace.program.body[0] as IfStatementKind).test,
        replace.program.body[1] as StatementKind
      )
    );

    expect(document.getText()).to.equal(testReplaceCode);

    // Close document
    await window.showTextDocument(document).then(() => {
      return commands.executeCommand('workbench.action.closeActiveEditor');
    });
  });

  test('extracts if blocks', () => {
    const node = astService.parse(testIfCode, 'js');
    const statements = astService.extractIfBlocks(node);
    expect(statements.length).to.equal(2);
  });

  test('extracts if blocks with max', () => {
    const node = astService.parse(testIfCode, 'js');
    const statements = astService.extractIfBlocks(node, null, 1);
    expect(statements.length).to.equal(1);
  });

  test('extracts if blocks with range', () => {
    const node = astService.parse(testIfCode, 'js');
    const statements = astService.extractIfBlocks(node, new Range(0, 0, 0, 100));
    expect(statements.length).to.equal(1);
  });

  test('extracts deep if blocks with range', () => {
    const node = astService.parse(testDeepIfCode, 'js');
    const statements = astService.extractIfBlocks(node, null, 1);
    const code = astService.stringify(statements[0].node, 'js');

    expect(code).to.equal('if (b) { c }');
  });

  test('extracts if blocks with cursor', () => {
    const node = astService.parse(testIfCode, 'js');
    const statements = astService.extractIfBlocks(node, new Range(0, 0, 0, 0));
    expect(statements.length).to.equal(1);
  });

  test('extracts conditions', () => {
    const node = astService.parse(testIfCode, 'js');
    const conditions = astService.extractConditions(node);
    expect(conditions.length).to.equal(2);
  });

  test('extracts conditions with max', () => {
    const node = astService.parse(testIfCode, 'js');
    const conditions = astService.extractConditions(node, null, 1);
    expect(conditions.length).to.equal(1);
  });

  test('extracts conditions with range', () => {
    const node = astService.parse(testIfCode, 'js');
    const conditions = astService.extractConditions(node, new Range(0, 0, 0, 100));
    expect(conditions.length).to.equal(0);
  });

  test('extracts conditions with cursor', () => {
    const node = astService.parse(testIfCode, 'js');
    const conditions = astService.extractConditions(node, new Range(0, 4, 0, 4));
    expect(conditions.length).to.equal(1);
  });

  test('chains conditions', () => {
    const conditions = ['a', 'b', 'c'].map(
      (s) => (astService.parse(s, 'js').program.body[0] as ExpressionStatementKind).expression
    );
    const chain = astService.chainConditions('&&', ...conditions);

    expect(astService.stringify(chain, 'js')).to.equal('a && b && c');
  });

  test('chains conditions with specified operator', () => {
    const conditions = ['a', 'b', 'c'].map(
      (s) => (astService.parse(s, 'js').program.body[0] as ExpressionStatementKind).expression
    );
    const chain = astService.chainConditions('||', ...conditions);

    expect(astService.stringify(chain, 'js')).to.equal('a || b || c');
  });

  test('chains conditions without conditions returns false', () => {
    const chain = astService.chainConditions('&&');

    expect(astService.stringify(chain, 'js')).to.equal('false');
  });
});
