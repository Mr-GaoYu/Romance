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
  offline: {
    type: 'boolean',
    default: false,
    describe: 'Prefer to use local offline packages'
  },
  force: {
    type: 'boolean',
    default: false,
    describe: 'Forced coverage'
  },
  username: {
    type: 'string',
    alias: 'u',
    default: '',
    describe: 'Specify the username used by git clone command'
  },
  registry: {
    type: 'string',
    alias: 'r',
    default: '',
    describe: 'Specify npm package download registry'
  },
  'project-presets': {
    type: 'string',
    default: '',
    hidden: true,
    describe: 'The JSON string of project preset according to PROMPTS in meta.js within template'
  },
  'use-cache': {
    type: 'boolean',
    alias: 'cache',
    default: false,
    describe: 'Preference is given to using the local cache of already downloaded tempalte'
  }
};


exports.handler = argv => {
  let {
    template,
    appName
  } = argv;
  console.log(argv, 123)

  if (template && appName === undefined) {

    if (isTemplatePath(template)) {

    } else {
      appName = template;
      template = defaultTemplate;
    }

  } else if (template === undefined) {
    console.log(12312)
  }

  const options = Object.assign(argv, {
    template,
    appName
  });
  require('./run')(template, appName, options)
}