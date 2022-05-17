const fs = require('fs-extra');
const path = require('path');
const {
  isLocalPath,
  getLocalTplPath
} = require('rom-cli-utils/path');
const prompt = require('../utils/prompt');
const {
  chalk
} = require('rom-cli-utils/ttyLogger');

function Task() {
  this.skipInfo = [];
  this.nextInfo = [];
  this.res = '';
  this.skip = data => {
    this.skipInfo.push(data);
  };
  this.info = data => {
    this.nextInfo.push(data);
  };
  this.error = err => {
    this.res = err;
  };
  this.complete = () => {
    this.res = 'done';
  };
}


const checkStatus = (template, dest, options) => {
  return async (ctx, task) => {
    task.info('Start checking target directory status');

    console.log(fs.existsSync(dest), 13123)

    if (fs.existsSync(dest)) {
      if (options.force) {
        task.info('--force delete target directory');
        fs.remove(dest);
      } else if (options._inPlace) {
        task.info();

        const {
          ok
        } = await prompt([{
          name: 'ok',
          type: 'confirm',
          message: 'Are you sure to create a project in the current directory?'
        }]);

        if (!ok) {
          return;
        }
      } else {
        task.info();
        const shortDest = path.relative(process.cwd(), dest);
        const {
          action
        } = await prompt([{
          name: 'action',
          type: 'select',
          // eslint-disable-next-line
          message: `The directory ${chalk.cyan(
                  shortDest
              )} already exists. Please select an operation：`,
          choices: [{
              title: 'overwrite',
              value: 'overwrite'
            },
            {
              title: 'merge',
              value: 'merge'
            },
            {
              title: 'cancel',
              value: false
            }
          ]
        }]);

        if (!action) {
          return task.error(`Cancel overwrite ${shortDest} directory`);

        } else if (action === 'overwrite') {
          task.info(`Overwrite selected, first delete ${shortDest}...`);
          await fs.remove(dest);
        }
      }
    }

    task.info('Check the status of the offline template');
    const isOffline = options.offline;

    if (isOffline || isLocalPath(template)) {

    }
    task.complete();
  }
}

let task = new Task();


checkStatus('https://github.com/yyt/HelloWorld.git', './temp', {
  _inPlace: false
})({}, task)