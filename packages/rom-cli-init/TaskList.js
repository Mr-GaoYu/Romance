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

    startSpinner(text) {
        if (this._spinner.isSpinning) {
            this._spinner.text = text;
        } else {
            this._spinner.start(text);
        }
    }
    stopSpinner() {
        if (this._spinner) {
            this._spinner.stop();
        }
    }

    getContext() {
        return this._context;
    }
    _setStatus(status) {
        switch (status) {
            case 'ready':
                throw console.log(`Error status: ${this._status} → ${status}`);
            case 'running':
                if (!['ready', 'pending'].includes(this._status)) {
                    throw console.log(`Error status: ${this._status} → ${status}`);
                }
                break;
            case 'pending':
                if (!['running'].includes(this._status)) {
                    throw console.log(`Error status: ${this._status} → ${status}`);
                }
                break;
            case 'done':
            case 'fail':
                if (['done', 'fail', 'ready'].includes(this._status)) {
                    throw console.log(`Error status: ${this._status} → ${status}`);
                }
                break;
            default:
                throw console.log('Error status: ' + status);
        }
        this._status = status;
    }

    run() {
        this._setStatus('running');
        this._startTask(0);
        return this._promise;
    }

    _startTask(idx, skipReason) {
        let { title, task } = this._tasks[idx];
        this.stopSpinner();
        const p = `[${this._index + 1}/${this._tasksLength}]`;
        if (skipReason) {
            console.log(chalk.dim(`${new Array(p.length + 1).join(' ')} ${figures.arrowRight} ${skipReason}`));
        }
        console.log(chalk.dim(p) + ` ${title}`);

        if (!this._spinner) {
            this._spinner = ora('In processing...', { spinner: 'point' }).start();
        }
        new Task(this, task).run();
    }
    done() {
        this.stopSpinner();
        this._resolve(this._context);
    }
    fail(err) {
        this.stopSpinner();
        this._reject(err);
    }
    next(skipReason) {
        this._index++;
        if (this._index >= this._tasksLength) {
            this._setStatus('done');
            this.done();
        } else {
            this._startTask(this._index, skipReason);
        }
    }
}