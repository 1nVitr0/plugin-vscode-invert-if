/* eslint-disable curly */

// @fixture simple-if-else
if (!a) {
  doOtherStuff();
} else {
  doStuff();
}

// @fixture if-without-else
if (!a) {
} else {
  doStuff();
}