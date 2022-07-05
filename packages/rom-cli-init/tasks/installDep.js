const fs = require('fs-extra');

module.exports = (template, dest, options) => {
    return async (ctx, task) => {
        const hasPackage = fs.existsSync(path.join(dest, 'package.json'));
        let install = hasPackage && options.install;
        let askInstall = !install;

        if (ctx.metaData && typeof ctx.metaData === 'object') {}

        if (hasPackage && askInstall) {}

        if (install) {

        }else{

        }
    }
}

function installDeps(dest, {verbose = false, registry, useYarn = true}) {
    let args = [];
    let command;
  
}