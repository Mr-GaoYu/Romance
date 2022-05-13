const SError = require('rom-cli-utils/SError');
const {
  ora,
  figures,
  chalk
} = require('rom-cli-utils/ttyLogger');

module.exports = class TaskList {
  constructor(tasks, options = {}) {
    this._tasks = tasks;
    this._options = options;
    this._index = 0;
    this._tasksLength = tasks.length;
    this._context = Object.create(null);

    this._status = 'ready'; // ready, pending, done, fail, running

    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  stopSpinner() {

  }

  _setStatus(status) {
    switch (status) {
      case 'ready':
        throw new SError(`Error status: ${this._status} → ${status}`);
      case 'running':
        if (!['ready', 'pending'].includes(this._status)) {
          throw new SError(`Error status: ${this._status} → ${status}`);
        }
        break;
      case 'pending':
        if (!['running'].includes(this._status)) {
          throw new SError(`Error status: ${this._status} → ${status}`);
        }
        break;
      case 'done':
      case 'fail':
        if (['done', 'fail', 'ready'].includes(this._status)) {
          // 这几种状态不能重设了
          throw new SError(`Error status: ${this._status} → ${status}`);
        }
        break;
      default:
        throw new SError('Error status: ' + status);
    }
    this._status = status;
  }

  _startTask(idx, skipReason) {
    let {
      title,
      task
    } = this._tasks[idx];

    this.stopSpinner();
    const p = `[${this._index + 1}/${this._tasksLength}]`;

    if (skipReason) {
      console.log(chalk.dim(`${new Array(p.length + 1).join(' ')} ${figures.arrowRight} ${skipReason}`));
    }

    console.log(chalk.dim(p) + ` ${title}`);

    if (!this._spinner) {
      this._spinner = ora('In processing...', {
        spinner: 'point'
      }).start();
    }
  }

  run() {
    this._setStatus('running');
    return this._promise;
  }
}