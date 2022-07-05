const { execSync } = require('child_process');

let isYarn;
exports.hasYarn = () => {
    if (isYarn != null) {
        return isYarn;
    }
    try {
        execSync('yarnpkg --version', { stdio: 'ignore' });
        return (isYarn = true);
    } catch (e) {
        return (isYarn = false);
    }
}

exports.getGitUser = () => {
    let name;
    let email;

    try {
        name = execSync('git config --get user.name');
        email = execSync('git config --get user.email');
        email = email.toString().trim();
        name = JSON.stringify(name.toString().trim()).slice(1, -1);
        const t = email && ' <' + email.toString().trim() + '>';
        return {
            name,
            email,
            author: (name || '') + (t || ''),
            isBaidu: /@baidu\.com/.test(email)
        };
    } catch (e) {
        return {};
    }
};

exports.currentOS = {
    isWindows: process.platform === 'win32',
    isMacintosh: process.platform === 'darwin',
    isLinux: process.platform === 'linux'
};
