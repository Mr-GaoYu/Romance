const {
  option
} = require("yargs");

class Task {
  constructor(taskListInstance, taskFn) {
    this.taskListInstance = taskListInstance;
    this.status = '';
    this.taskFn = taskFn;
  }
  getContext() {
    return this.taskListInstance.getContext();
  }
  run() {
    this.status = 'running';
    this.taskFn(this.getContext(), this);
  }
  skip(skipReason) {
    this.status = 'skiped';
    this.taskListInstance.next(skipReason);
  }
  complete() {
    if (this.status === 'running') {
      this.status = 'done';
      this.taskListInstance.next();
    }
  }
  error(err) {
    if (this.status === 'running') {
      this.status = 'failed';
      this.taskListInstance.fail(err);
    }
  }
  info(data) {
    if (data) {
      this.taskListInstance.startSpinner(data);
    } else {
      this.taskListInstance.stopSpinner();
    }
  }
}

module.exports = class TaskList {
  constructor(tasks, options = {}) {
    this._tasks = tasks;
    this._options = options;
    this._index = 0;
    this._tasksLength = tasks.length;
    this._context = Object.create(null);
    this._status = 'ready';
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  getContext() {
    return this._context
  }
}