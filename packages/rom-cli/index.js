/**
 * 1. 设置环境变量
 * 2. 检测Node版本
 * 3. 脚手架命令
 */

const {
  name: pkgName,
  version: pkgVersion,
  scriptName,
  engines: {
    node: nodeVersion
  }
} = require('./package.json')
const semver = require('semver')
const chalk = require('chalk')
const updateNotifier = require('update-notifier')

function setProcess() {
  process.title = scriptName

  process.on('uncaughtException', error => {
    console.error(error);
    process.exit(1);
  });

  process.on('unhandledRejection', error => {
    console.error(error);
    process.exit(1);
  });
}

function checkNodeVersion(id, wanted) {
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
  // 程序终止监听
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      notifier && notifier.notify();
      process.exit(0);
    });
  });
}

function execCommand() {
  const cmdName = process.argv[2]
  // 帮助文档  rom -h || rom -H || rom --help
  if (['-h', '-H', '--help'].includes(cmdName)) {
    console.log(`For more information, visit ${chalk.cyan('https://github.com/Mr-GaoYu/Romance.git')}`);
    return;
  }

  // 版本号  rom -v || rom -V || rom --version
  if (['-v', '-V', '--version'].includes(cmdName)) {
    console.log(pkgVersion)
    return
  }

  if (!cmdName || cmdName.startsWith('-')) {
    console.error(
      `No command is given, you can install any ${chalk.cyan('rom-cli-*')} package to install a command`
    );
    return;
  }

  try {
    const subCommands = [`rom-cli-${cmdName}`];
    for (let i = 0, len = subCommands.length; i < len; i++) {
      const subPkgName = subCommands[i];
      const command = require(subPkgName);
      if (command && command.command) {
        const {
          name,
          version
        } = require(`${subPkgName}/package.json`);
        upNotifier(version, name)
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

  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND' && e.requireStack && e.requireStack[0] === require.resolve(__filename)) {
      console.error(chalk.red(`[${cmdName}] command not found, you may install rom-cli-${cmdName}`));
    } else {
      console.error(e);
    }
    process.exit(1);
  }
}

setProcess()
checkNodeVersion(pkgName, nodeVersion)
execCommand()