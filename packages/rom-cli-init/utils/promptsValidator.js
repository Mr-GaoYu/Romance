module.exports = (prompts, presets) => {
  if (typeof presets !== 'object') {
      return false;
  }

  const keys = Object.keys(prompts);
  for (const key of keys) {
      const prompt = prompts[key];
      let isRequired = false;
      if (prompt.required) {
          isRequired = true;
      }
      else if (prompt.when) {
          isRequired = !!presets[prompt.when];
      }
      else if (prompt.type === 'list') {
          isRequired = true;
      }

      if (!isRequired) {
          continue;
      }

      const preset = presets[key];

      if (!preset) {
          console.log(`❗️ Project presets ${key} is not specified.`);
          return false;
      }

      if (prompt.type === 'list') {
          const choices = prompt.choices.map(item => item.value);
          if (choices.indexOf(preset) === -1) {
              console.log(`❗️ Project presets ${key} is illegal.`);
              return false;
          }
      }
  }
  return true;
};