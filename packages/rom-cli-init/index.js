exports.command = 'init [template] [app-name]';

exports.description = 'Create an empty repo';

exports.builder = {}

exports.handler = argv => {
  let {
    template,
    appName
  } = argv;

  if (template && appName === undefined) {

  } else if (template === undefined) {

  }
}