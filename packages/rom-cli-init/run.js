const TaskList = require('./TaskList');

module.exports = (template, appName, options = {}) => {
  console.log(template, appName, options, 111)

  const tasks = []

  const taskList = new TaskList(tasks);

  taskList
    .run().then(() => {

    })
}