module.exports = template => {
    if (/[#:]/.test(template)) {
        return true;
    }

    if (template.indexOf('/') === -1) {
        return false;
    }

    if (template.split('/').length > 2) {
        return false;
    }

    return true;
};
