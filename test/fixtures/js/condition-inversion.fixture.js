/* eslint-disable eqeqeq */
/* eslint-disable curly */

// @fixture simple-equal
if (a == b) doStuff();

// @fixture strict-equal
if (a === b) doStuff();

// @fixture simple-unequal
if (a != b) doStuff();

// @fixture strict-unequal
if (a !== b) doStuff();

// @fixture strict-less-than
if (a < b) doStuff();

// @fixture strict-more-than
if (a > b) doStuff();

// @fixture less-or-equal-than
if (a <= b) doStuff();

// @fixture more-or-equal-than
if (a >= b) doStuff();

// @fixture simple-equal-negated
if (!(a == b)) doStuff();

// @fixture simple-less-or-equal-than-negated
if (!(a <= b)) doStuff();

// @fixture property-equal
if (a.some.property == b.some.other.property) doStuff();

// @fixture property-accessor-equal
if (a.some['property'] == b.some['other-property']) doStuff();

// @fixture array-accessor-equal
if (a.some[0] == b.some[192]) doStuff();

// @fixture simple-and-equal
if (a == b && c == d) doStuff();

// @fixture simple-or-equal
if (a == b || c == d) doStuff();

// @fixture simple-and-mixed
if (a < b && c >= d) doStuff();

// @fixture simple-or-mixed
if (a < b || c >= d) doStuff();

// @fixture math-simple-equal
if (a / 10 == b * 10 + 3) doStuff();

// @fixture math-simple-comparison
if (a / 10 >= b * 10 + 3) doStuff();

// @fixture math-bitwise-simple-equal
if (a & 0xf637 == b | 0b10010010) doStuff();

// @fixture grouped-and-or-equal
if ((a == b && c == d) || (e == f && g == h)) doStuff();

// @fixture grouped-or-and-equal
if ((a == b || c == d) && (e == f || g == h)) doStuff();

// @fixture grouped-and-or-mixed
if ((a < b && c > d) || (e <= f && g >= h)) doStuff();

// @fixture grouped-or-and-mixed
if ((a < b || c > d) && (e <= f || g >= h)) doStuff();

// @fixture grouped-and-or-equal-negated
if ((a == b && c == d) || !(e == f && g == h)) doStuff();

// @fixture grouped-or-and-equal-negated
if ((a == b || c == d) && !(e == f || g == h)) doStuff();

// @fixture grouped-nested-mixed
if ((a < b && c > d) || ((e <= f || g >= h) && !i)) doStuff();