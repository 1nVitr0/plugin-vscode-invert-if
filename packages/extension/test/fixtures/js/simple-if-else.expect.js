/* eslint-disable curly */

// @fixture multiline-if-curly
if (!variable) {
  console.log('variable is false');
} else {
  //Multiline if
  console.log('variable is true');
}

// @fixture multiline-else-curly
if (!variable) {
  //Multiline else
  console.log('variable is false');
} else {
  console.log('variable is true');
}

// @fixture inline-if-else
if (!variable) console.log('variable is false');
else console.log('variable is true');

// @fixture indented-if-else
if (!variable)
  console.log('variable is false');
else
  console.log('variable is true');

// @fixture indented-if
if (!variable)
  console.log('variable is false');
else console.log('variable is true');

// @fixture indented-else
if (!variable) console.log('variable is false');
else
  console.log('variable is true');

// @fixture if-curly
if (!variable) console.log('variable is false');
else {
  console.log('variable is true');
}

// @fixture else-curly
if (!variable) {
  console.log('variable is false');
} else console.log('variable is true');

// @fixture multiline-curly-if
if (!variable) console.log('variable is false');
else {
  // Multiline if
  console.log('variable is true');
}

// @fixture multiline-curly-else
if (!variable) {
  // Multiline else
  console.log('variable is false');
} else console.log('variable is true');

// @fixture if-else-curly-newline
if (!variable)
{
  //Multiline else
  console.log('variable is false');
}
else
{
  console.log('variable is true');
}