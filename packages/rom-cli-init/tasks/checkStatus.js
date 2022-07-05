const fs = require('fs-extra');
const {isLocalPath, getLocalTplPath} = require('san-cli-utils/path');

module.exports = (template, dest, options) => {
    return async (ctx, task) => {
        task.info('Start checking target directory status')

        if(fs.existsSync(dest)){

        }

        task.info('Check the status of the offline template')
        const isOffline = options.offline;

        task.complete();
    }
}