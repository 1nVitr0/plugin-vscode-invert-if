import { extensions } from 'vscode';

export const EXTENSION_ORG = '1nVitr0';
export const EXTENSION_NAME = 'invert-if';
export const EXTENSION_ID = `${EXTENSION_ORG}.${EXTENSION_NAME}`;

export async function activateExtension() {
  const ext = extensions.getExtension(EXTENSION_ID);
  return ext?.activate() || null;
}
