import { commands, workspace, window, Selection } from 'vscode';
import asyncSuite from '../../../helpers/asyncSuite';
import { activateExtension } from '../../../helpers/extensionTools';
import FixtureTestRunner from '../../../helpers/FixtureTestRunner';

asyncSuite('Fixture tests for simple if else inversion', async function () {
  await activateExtension();

  const suites = await FixtureTestRunner.suiteRunners('command-condition-inversion', async (code) => {
    const document = await workspace.openTextDocument({ language: 'js', content: code });
    const cursor = document.positionAt(document.getText().indexOf('$'));

    await window.showTextDocument(document, { selection: new Selection(cursor, cursor) });
    await commands.executeCommand('invertIf.invertCondition');

    // Close document
    await window.showTextDocument(document).then(() => {
      return commands.executeCommand('workbench.action.closeActiveEditor');
    });

    return document.getText();
  });

  return FixtureTestRunner.suites(suites, this);
});
