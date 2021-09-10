/* eslint-disable curly */

// @fixture simple-while
while (!variable) {
  // do stuff
}

//@fixture simple-do-while
do {
  // do stuff
} while (!variable);

//@fixture simple-inline-while
while (!variable) console.log('doing stuff');


//@fixture simple-inline-do-while
do console.log('doing stuff'); while (!variable);

// @fixture simple-for
for (let i = 10; !i; i--) {
  // do stuff
}

// @fixture simple-inline-for
for (let i = 10; !i; i--) console.log('doing stuff');

// @fixture simple-if
if (!variable) {
  // do stuff
}

// @fixture simple-inline-if
if (!variable) console.log('doing stuff');


// @fixture simple-elseif
if (false) {
  // do stuff
} else if (!variable) {
  // do other stuff
}

// @fixture simple-inline-elseif
if (false) console.log('doing stuff');
else if (!variable) console.log('doing other stuff');

// @fixture simple-curly-newline-elseif
if (false) {
  // do stuff
}
else if (!variable) {
  // do other stuff
}