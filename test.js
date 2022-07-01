const figures = require('figures');
const { sep } = require('path')
const escapeStringRegexp = require('escape-string-regexp');
const stripAnsi = require('strip-ansi');


const { platform } = process;

console.log(platform, figures('!'))

const a = '!'.replace(new RegExp(escapeStringRegexp('7/8'), 'g'), 6);
console.log(a)

console.log(sep, process.cwd())

console.log(stripAnsi('%2D3213'), 11)