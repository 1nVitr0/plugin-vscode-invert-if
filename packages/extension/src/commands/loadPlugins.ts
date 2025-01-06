/**
 * Dummy command to load plugins. Not contributed to the command palette.
 * Plugins extending this extension should listen to this command instead of "*".
 *
 * @command invertIf.loadPlugins
 */
export default async function loadPlugins() {
  console.info("Invert If: Loading plugins...");
}
