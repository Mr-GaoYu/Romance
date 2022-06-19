const boxen = require('boxen')
const readline = require('readline')
const fs = require('fs')
const consola = require('consola')
const figures = require('figures');
const stringWidth = require('string-width');
const debug = require('debug');

const debugA = debug('avgA:');
debugA.enabled =true
debugA('hello world');

// console.log(boxen('unicorn', {
//   padding: 1
// }));
// console.log(boxen('unicorn', {
//   padding: 1,
//   margin: 1,
//   borderStyle: 'double'
// }));



// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.question('Please input a word: ', function(answer){
//   console.log('You have entered [%s]', answer.toUpperCase());
//   rl.close();
// });


// const clearConsole = () => {
//   if (process.stdout.isTTY) {
//     const blank = '\n'.repeat(process.stdout.rows);
//     console.log(blank)
//     readline.cursorTo(process.stdout, 0, 0);
//     readline.clearScreenDown(process.stdout);
//   }
// };


consola.success('Built!')
consola.info('Reporter: Some info')
consola.error(new Error('Foo'))

const fn = new Function('data', 'data');

console.log(fn({a:'asdasd'}))

console.log(stringWidth('aa'),11)

