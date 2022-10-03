/* eslint-disable curly */

// @fixture multiline-if-curly
if (variable) {
  //Multiline if
  console.log('variable is true');
} else {
  console.log('variable is false');
}

// @fixture multiline-else-curly
if (variable) {
  console.log('variable is true');
} else {
  //Multiline else
  console.log('variable is false');
}

// @fixture inline-if-else
if (variable) console.log('variable is true');
else console.log('variable is false');

// @fixture indented-if-else
if (variable)
  console.log('variable is true');
else
  console.log('variable is false');

// @fixture indented-if
if (variable) 
console.log('variable is true');
else console.log('variable is false');

// @fixture indented-else
if (variable) console.log('variable is true');
else
  console.log('variable is false');

// @fixture if-curly
if (variable) {
  console.log('variable is true');
} else console.log('variable is false');

// @fixture else-curly
if (variable) console.log('variable is true');
else {
  console.log('variable is false');
}

// @fixture multiline-curly-if
if (variable) {
  // Multiline if
  console.log('variable is true');
} else console.log('variable is false');

// @fixture multiline-curly-else
if (variable) console.log('variable is true');
else {
  // Multiline else
  console.log('variable is false');
}

// @fixture if-else-curly-newline
if (variable)
{
  console.log('variable is true');
}
else
{
  //Multiline else
  console.log('variable is false');
}