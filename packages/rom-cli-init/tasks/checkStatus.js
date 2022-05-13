const fs = require('fs-extra');

module.exports = (template, dest, options) => {
  return async (ctx, task) => {
    task.info('Start checking target directory status');

    console.log(dest, 13123)

    if (fs.existsSync(dest)) {
      if (options.force) {
        task.info('--force delete target directory');
        fs.remove(dest);
      }
    }

    task.info('Check the status of the offline template');
  }
}