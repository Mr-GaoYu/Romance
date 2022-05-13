const ConsolaReporter = require("rom-cli-utils/ConsolaReporter");
const path = require('path');
const checkStatus = require('./tasks/checkStatus');
const TaskList = require('./TaskList');


module.exports = (template, appName, options = {}) => {
  const inPlace = !appName || appName === '.';

  options._inPlace = inPlace;

  const dest = path.resolve((appName + '') || '.');

  const startTime = Date.now();
  console.log(dest, 11)
  const tasks = [{
    title: '🔍 Checking directory and offline template status...',
    task: checkStatus(template, dest, options)
  }, ];

  const taskList = new TaskList(tasks);
  taskList
    .run()
}