import { logger } from "../globals";

/**
 * Dummy command to load plugins. Not contributed to the command palette.
 * Plugins extending this extension should listen to this command instead of "*".
 * 
 * @internal
 * @hidden
 * @command invertIf.loadPlugins
 */
export default async function loadPlugins() {
  logger.debug("Loading plugins...");
}
