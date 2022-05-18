const {error} = require('rom-cli-utils/ttyLogger');
module.exports = (exp, data) => {
  const fn = new Function('data', 'with (data) { return ' + exp + '}');
  try {
      return fn(data);
  } catch (e) {
      error(`Error when evaluating filter condition: ${exp}`);
  }
};