import { commands, workspace, window } from 'vscode';
import asyncSuite from '../../../helpers/asyncSuite';
import { activateExtension } from '../../../helpers/extensionTools';
import FixtureTestRunner from '../../../helpers/FixtureTestRunner';

asyncSuite('Fixture tests for simple if else inversion', async function () {
  await activateExtension();

  const suites = await FixtureTestRunner.suiteRunners('command-if-inversion', async (code) => {
    const document = await workspace.openTextDocument({ language: 'js', content: code });
    await window.showTextDocument(document);
    await commands.executeCommand('invertIf.invertIfElse');

    // Close document
    await window.showTextDocument(document).then(() => {
      return commands.executeCommand('workbench.action.closeActiveEditor');
    });

    return document.getText();
  });

  return FixtureTestRunner.suites(suites, this);
});
