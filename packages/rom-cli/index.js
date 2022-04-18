#!/usr/bin/env node

const semver = require('semver');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');

const {
  scriptName,
  engines: {
    node: nodeVersion
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

function checkNodeVersion(version, name) {
  if (!semver.satisfies(process.version, version)) {
    console.error(
      'You are using Node ' + process.version + ', but this version of ' + name +
      ' requires ' + chalk.yellow('Node ' + version) + '.\nPlease upgrade your Node version.'
    );
    process.exit(1);
  }
}

function upNotifier(version, name) {
  if (version && name) {
    // 检测版本更新
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
    console.log(`For more information, visit ${chalk.cyan('https://ecomfe.github.io/rom-cli')}`);
    return;
  }

  if (!cmdName || cmdName.startsWith('-')) {
    console.error(
      `No command is given, you can install any ${chalk.cyan('rom-cli-*')} package to install a command`
    );
    return;
  }

  try {
    const pkgName = `rom-cli-${cmdName}`;
    const command = require(pkgName);

    if (command && command.command) {
      const {
        name,
        version
      } = require(`${pkgName}/package.json`);
      console.log(`${pkgName}@${pkgVersion}/${name}@${version}`);

      upNotifier(version, name)

      require('yargs')
        .scriptName(scriptName)
        .usage('$0 <cmd> [args]')
        .command(command)
        .help()
        .alias('help', 'h')
        .alias('version', 'v').argv;
    }

  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' && error.requireStack && error.requireStack[0] === require.resolve(__filename)) {
      // 没找到
      console.error(chalk.red(`[${cmdName}] command not found, you may install san-cli-${cmdName}`));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

setProcess(scriptName);

checkNodeVersion(nodeVersion, pkgName);

execCommand()