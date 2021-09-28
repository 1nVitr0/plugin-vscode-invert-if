const { TSDocParser, DocNode } = require('@microsoft/tsdoc');
const { readFileSync } = require('fs');
const { readFileSync: readJsonFile, writeFileSync: writeJsonFile } = require('jsonfile');
const { glob } = require('glob');
const { resolve, join } = require('path');

const root = resolve(__dirname, '../src');
const packageFile = resolve(__dirname, '..', 'package.json');
const contributions = [
  { type: 'commands', files: 'commands/**/**.ts', activation: { type: 'onCommand', key: 'command' } }
]

/** 
 * @param {DocNode} node 
 * @param {string} tagName
 * @returns {DocNode | undefined}
 * */
function getDocObject (node) {
  // while (node.kind == 'Paragraph') node = node.getChildNodes()[0];
  children = node && node.getChildNodes();
  if (!children.length) return null;

  const result = {};
  let currentTag = '';
  for (const child of children) {
    if (child.kind == 'Paragraph') return findDocNode(child, tagName);
    if (currentTag && child.text) result[currentTag] += child.text;
    if (child.tagName) {
      if (currentTag) result[currentTag] = result[currentTag].trim();
      currentTag = child.tagName.replace('@', '');
      result[currentTag] = '';
    }
  }

  if (currentTag) result[currentTag] = result[currentTag].trim();
  return result;
}

function addActivationEvent(data, options) {
  const value = `${options.type}:${data[options.key]}`;
  
  package.activationEvents.push(`${options.type}:${data[options.key]}`);
}

const package = readJsonFile(packageFile);
const parser = new TSDocParser();

// Reset activation events
package.activationEvents = [];

for (const contribution of contributions) {
  const files = glob.sync(contribution.files, { cwd: root })

  const docs = files.map(file => readFileSync(join(root, file), 'utf-8'));
  const ranges = docs.reduce((acc, doc) => [...acc, ...doc.split(/(?=\/\*\*)/)], []);
  const contexts = ranges.map(range => parser.parseString(range));

  const contributionEntry = [];
  for (const context of contexts) {
    const summary = context.docComment.summarySection;
    const descriptor = summary.nodes.length && getDocObject(summary.nodes[0]);

    if (descriptor) contributionEntry.push(descriptor);
    if(descriptor && contribution.activation) addActivationEvent(descriptor, contribution.activation);
  }

  package.contributes[contribution.type] = contributionEntry;
}

writeJsonFile(packageFile, package, { spaces: 2 });