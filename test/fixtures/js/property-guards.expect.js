/* eslint-disable curly */

// @fixture simple-property-guard
if (!a.prop || a.prop.length !== b) doStuff();

// @fixture property-guard-nested-condition
if (!a.prop || (c && a.prop.length !== b)) doStuff();

// @fixture nested-property-guard
if ((!a.prop || a.prop.length !== b) && !c) doStuff();