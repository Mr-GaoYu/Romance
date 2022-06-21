const Consola = require('consola').Consola;
const debug = require('debug');
const ConsolaReporter = require('./ConsolaReporter');
const {
  textColor,
  bgColor
} = require('./randomColor');
const chalk = require('chalk');
const figures = require('figures');

const perfDebug = debug('rom-cli:perf');


module.exports =  class SanConsola extends Consola {
  constructor(options = {}) {
    options = Object.assign({
        level: process.env.CONSOLA_LEVEL || 3,
        reporters: [new ConsolaReporter()]
      },
      options
    );
    super(options);

    this.textColor = textColor;
    this.bgColor = bgColor;

    const map = new Map();

    this.time = name => {
      map.set(name, Date.now());
    }

    this.timeEnd = name => {
      if (perfDebug.enabled) {
        const start = map.get(name);
        if (!start) {
          return;
        }
        let d = Date.now() - start;
        if (d >= 1e3) {
          d = chalk.redBright.bold(`${d}ms`);
        } else if (d >= 3e2) {
          d = chalk.yellowBright.bold(`${d}ms`);
        } else {
          d = chalk.greenBright(`${d}ms`);
        }
        this.log(`${chalk.grey(figures.play)} ${name}: ${d}`);
      }
    }
  }
}
