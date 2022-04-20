const chalk = require('chalk');

const COMMON_COLOR = 'green';
exports.COMMON_COLOR = COMMON_COLOR;

const bgColorMap = new Map();

function chalkBgColor(name) {
  let color = bgColorMap.get(name);
  if (color) {
    return color;
  }

  if (name[0] === '#') {
    color = chalk.bgHex(name);
  } else {
    color = chalk['bg' + name[0].toUpperCase() + name.slice(1)] || chalk.bgKeyword(name);
  }

  bgColorMap.set(name, color);
  return color;
}

exports.chalkBgColor = chalkBgColor;


function chalkColor(name) {
  let color = colorMap.get(name);
  if (color) {
    return color;
  }

  if (name[0] === '#') {
    color = chalk.hex(name);
  } else {
    color = chalk[name] || chalk.keyword(name);
  }

  colorMap.set(name, color);
  return color;
}
exports.chalkColor = chalkColor;

function textCommonColor(txt) {
  return chalkColor(COMMON_COLOR)(txt);
}
exports.textCommonColor = textCommonColor;

function textCommonBold(txt) {
  return chalk.bold(chalkColor(COMMON_COLOR)(txt));
}
exports.textCommonBold = textCommonBold;
