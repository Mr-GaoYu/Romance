const ConsolaReporter = require("rom-cli-utils/ConsolaReporter");
const path = require('path');
const checkStatus = require('./tasks/checkStatus');
const TaskList = require('./TaskList');
const Handlebars = require('./handlerbars');
const consolidate = require('consolidate');
const {timeCost} = require('rom-cli-utils/utils');


function logMessage(message, data) {
  if (Handlebars.isHandlebarTPL(message)) {
    consolidate.handlebars
      .render(message, data)
      .then(res => {

        console.log(res);
      })
      .catch(error);
  } else if (message) {
    console.log(message);
  }
}

module.exports = (template, appName, options = {}) => {
  const inPlace = !appName || appName === '.';

  options._inPlace = inPlace;

  const dest = path.resolve((appName + '') || '.');

  const startTime = Date.now();

  const tasks = [{
    title: '🔍 Checking directory and offline template status...',
    task: checkStatus(template, dest, options)
  },];

  const taskList = new TaskList(tasks);
  taskList
    .run()
    .then(({ metaData: opts, tplData: data }) => {
      const duration = timeCost(startTime);

      console.log('✨  Done in ' + duration + 's.');
      opts = opts || {};

      if (typeof opts.complete === 'function') {
        opts.complete(data, {
            chalk,
            logger: {
                boxen,
                error,
                fatal,
                success
            },
            files: []
        });
    }
    else {
        logMessage(opts.completeMessage, data);
    }
    process.exit(0);
    })
    .catch(e => {
      error(e);
      process.exit(1);
    });
}