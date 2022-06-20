const prompts = require('prompts');
const evaluate = require('./utils/evaluate');
const render = require('consolidate').handlebars.render;
const { chalk } = require('rom-cli-utils/ttyLogger');

const promptMapping = {
  string: 'text',
  boolean: 'confirm',
  list: 'select'
};

module.exports = async (prompts, data, argv) => {
  const answers = {};
  let keys = Object.keys(prompts);
  let key;

  while (key = keys.shift()) {
    if (argv[key]) {
      answers[key] = argv[key]
    } else {
      await prompt(answers, key, prompts[key], data);
    }
  }

  return answers
}

async function prompt(data, key, prompt, tplData) {
  if (prompt.when && !evaluate(prompt.when, data)) {
    return
  }

  let promptDefault = typeof prompt.default === 'function'
    ? function () {
      return prompt.default.bind(this)(data);
    }
    : prompt.default;

  let initial = promptDefault;

  if (promptDefault && typeof promptDefault === 'string') {
    try {
      initial = await render(promptDefault, {
        noEscape: true,
        ...tplData
      });
    } catch (error) {
      console.warn(`${chalk.red('✖')} Handbars render [name: ${key}] error`);
    }
  }

  const answers = await prompts([
    {
      type: promptMapping[prompt.type] || prompt.type,
      name: key,
      message: prompt.message || prompt.label || key,
      initial,
      choices: prompt.choices || [],
      validate: prompt.validate || (() => true)
    }
  ]);

  if (Array.isArray(answers[key])) {
    data[key] = {};
    answers[key].forEach(multiChoiceAnswer => {
      data[key][multiChoiceAnswer] = true;
    });
    // 如果答案是串型，转义一下双引号
  }
  else if (typeof answers[key] === 'string') {
    data[key] = answers[key].replace(/"/g, '\\"');
  }
  else {
    // 其他类型的直接赋值
    data[key] = answers[key];
  }
}