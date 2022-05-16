const fs = require('fs-extra');
const {isLocalPath, getLocalTplPath} = require('rom-cli-utils/path');

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
      }
    }

    task.info('Check the status of the offline template');
    const isOffline = options.offline;

    if(isOffline || isLocalPath(template)){

    }
    task.complete();
  }
}

let task = new Task();

checkStatus('https://github.com/yyt/HelloWorld.git', 'none', {})({}, task)