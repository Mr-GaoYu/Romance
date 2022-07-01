#!/usr/bin/env node

const semver = require('semver');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const {
  scriptName,
  engines: {
    node: requiredNodeVersion
  },
  name: pkgName,
  version: pkgVersion
} = require('./package.json');



function setProcess(scriptName) {
  process.title = scriptName;
  process.on('uncaughtException', error => {
    console.error(error);
    process.exit(1);
  });

  process.on('unhandledRejection', error => {
    console.error(error);
    process.exit(1);
  });
  
}

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.error(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires ' + chalk.yellow('Node ' + wanted) + '.\nPlease upgrade your Node version.'
    );
    process.exit(1);
  }
}

function upNotifier(version, name) {
  let notifier;
  if (version && name) {
    notifier = updateNotifier({
      pkg: {
        name,
        version
      },
      updateCheckInterval: 1000 * 60 * 60 * 24 * 7, // 1 week
      isGlobal: true,

      shouldNotifyInNpmScript: true
    });
  }
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      notifier && notifier.notify();
      process.exit(0);
    });
  });
}

function execCommand() {
  const cmdName = process.argv[2];

  if (['-v', '-V', '--version'].includes(cmdName)) {
    console.log(pkgVersion);
    return;
  }

  if (['-h', '--help'].includes(cmdName)) {
    console.log(`For more information, visit ${chalk.cyan('https://github.com/Mr-GaoYu/Romance.git')}`);
    return;
  }

  if (!cmdName || cmdName.startsWith('-')) {
    console.error(
      `No command is given, you can install any ${chalk.cyan('rom-cli-*')} package to install a command`
    );

    return
  }

  try {
    const subCommands = [`rom-cli-${cmdName}`]
    for (let i = 0, len = subCommands.length; i < len; i++) {
      const subPkgName = subCommands[i];
      const command = require(subPkgName);
      if (command && command.command) {
        const {
          name,
          version
        } = require(`${subPkgName}/package.json`);
        console.log(`${pkgName}@${pkgVersion}/${name}@${version}`);

        upNotifier(version, name);

        require('yargs')
          .scriptName(scriptName)
          .usage('$0 <cmd> [args]')
          .command(command)
          .help()
          .alias('help', 'h')
          .alias('version', 'v').argv;

        break;
      }
    }
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' && error.requireStack && error.requireStack[0] === require.resolve(__filename)) {
      console.error(chalk.red(`[${cmdName}] command not found, you may install san-cli-${cmdName}`));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

setProcess(scriptName);
checkNodeVersion(requiredNodeVersion, pkgName);
execCommand();