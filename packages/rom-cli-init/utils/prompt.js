const prompts = require('prompts');


module.exports = input => {
    if (!Array.isArray(input)) {
        input = [input];
    }
    return prompts(input);
};
