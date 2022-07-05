const hash = require('hash-sum');

exports.isLocalPath = templatePath => {
    return /^[./]|(^[a-zA-Z]:)/.test(templatePath);
};

exports.getLocalTplPath = template => {
    return path.join(
        getUserHomeFolder(),
        'templates',
        hash(template),
        template.replace(/[/:#]/g, '-').substring(template.lastIndexOf('/') + 1)
    );
};
function getUserHomeFolder() {
    return path.join(home, '.rom');
}