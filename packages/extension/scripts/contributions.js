const { TSDocParser, DocNode } = require('@microsoft/tsdoc');
const { readFileSync } = require('fs');
const { readFileSync: readJsonFile, writeFileSync: writeJsonFile } = require('jsonfile');
const { glob } = require('glob');
const { resolve, join } = require('path');

const root = resolve(__dirname, '../src');
const packageFile = resolve(__dirname, '..', 'package.json');
const defaultActivationEvents = [
  'onLanguage:typescript',
  'onLanguage:javascript',
  'onLanguage:javascriptreact',
  'onLanguage:typescriptreact',
  'onLanguage:flow',
  'onLanguage:babylon',
];
const contributions = [
  { type: 'commands', files: 'commands/**/**.ts', activation: { type: 'onCommand', key: 'command' } }
]

/** 
 * @param {DocNode} node 
 * @param {string} tagName
 * @returns {DocNode | undefined}
 * */
function getDocObject (nodes = []) {
  children = nodes.flatMap(node => node.getChildNodes());
  if (!children.length) return null;

  const result = {};
  let currentTag = '';
  for (const child of children) {
    if (child.kind == 'Paragraph') continue;
    if (currentTag && child.text) result[currentTag] += child.text;
    if (child.tagName) {
      if (currentTag) result[currentTag] = result[currentTag].trim() || true;
      currentTag = child.tagName.replace('@', '');
      result[currentTag] = '';
    }
  }

  if (currentTag) result[currentTag] = result[currentTag].trim() || true;
  return result;
}

function addActivationEvent (data, options) {
  if (!data[options.key]) return;
  package.activationEvents.push(`${options.type}:${data[options.key]}`);
}

const package = readJsonFile(packageFile);
const parser = new TSDocParser();

// Reset activation events
package.activationEvents = defaultActivationEvents;

for (const contribution of contributions) {
  const files = glob.sync(contribution.files, { cwd: root })

  const docs = files.map(file => readFileSync(join(root, file), 'utf-8'));
  const ranges = docs.reduce((acc, doc) => [...acc, ...doc.split(/(?=\/\*\*)/)], []);
  const contexts = ranges.map(range => parser.parseString(range));

  const contributionEntry = [];
  for (const context of contexts) {
    const summary = context.docComment.summarySection;
    const descriptor = summary.nodes.length && getDocObject(summary.nodes);

    if (descriptor && !descriptor.hidden) contributionEntry.push(descriptor);
    if (descriptor && contribution.activation) addActivationEvent(descriptor, contribution.activation);
  }

  package.contributes[contribution.type] = contributionEntry;
}

writeJsonFile(packageFile, package, { spaces: 2 });