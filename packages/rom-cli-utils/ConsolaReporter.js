const {
  FancyReporter
} = require('consola');
const figures = require('figures');
const {
  COMMON_COLOR
} = require('./color');

const TYPE_ICONS = {
  info: figures('ℹ'),
  success: figures('✔'),
  debug: figures('›'),
  trace: figures('›'),
  error: figures('✖'),
  warning: figures('⚠'),
  warn: figures('⚠'),
  fatal: figures('☒'),
  log: ''
};

const TYPE_COLOR_MAP = {
  success: COMMON_COLOR,
  info: COMMON_COLOR,
  note: 'white',
  warn: 'yellow',
  warning: 'yellow',
  error: 'red',
  fatal: 'red'
};

const LEVEL_COLOR_MAP = {
  0: 'red',
  1: 'yellow',
  2: 'white',
  3: 'green'
};



module.exports = class ConsolaReporter extends FancyReporter {
  formatType(logObj, isBadge) {
    
  }
}