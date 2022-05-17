const prompts = require('prompts');

// 交互式问询
module.exports = input => {
    if (!Array.isArray(input)) {
        input = [input];
    }
    return prompts(input);
};
