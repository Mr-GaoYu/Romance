exports.command = 'init [template] [app-name]';

exports.description = 'Create an empty repo';

exports.builder = {
  'no-cache': {
    default: true,
    type: 'boolean',
    describe: 'Use local cache'
  },
  'no-yarn': {
    type: 'boolean',
    default: false,
    describe: 'Use yarn, if it exists.'
  },
  install: {
    type: 'boolean',
    default: false,
    describe: 'Install npm packages after initialization'
  },
}

// 默认脚手架
const defaultTemplate = 'wanwu/san-project#v4';

exports.handler = argv => {
  let {
    template,
    appName
  } = argv;

  if (template && appName === undefined) {

  } else if (template === undefined) {
    template = defaultTemplate;
    appName = './';
    console.log(`Use ${defaultTemplate} as scaffold template.`)
  }

  const options = Object.assign(argv, { template, appName });
  require('./run')(template, appName, options);
}