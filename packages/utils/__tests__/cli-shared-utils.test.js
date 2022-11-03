'use strict';

const cliSharedUtils = require('..');
const assert = require('assert').strict;

assert.strictEqual(cliSharedUtils(), 'Hello from cliSharedUtils');
console.info('cliSharedUtils tests passed');
