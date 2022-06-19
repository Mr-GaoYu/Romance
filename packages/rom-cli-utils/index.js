['ttyLogger', 'path', 'utils', 'randomColor', 'env', 'color'].forEach(m => {
  Object.assign(exports, require(`./${m}`));
});

['readPkg', 'readRc', 'argsert', 'Consola', 'SError'].forEach(m => {
  exports[m] = require(`./${m}`);
});
