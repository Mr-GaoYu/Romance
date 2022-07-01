module.exports = class SError extends Error {
    constructor(msg, type, stack) {
        super(msg || 'Rom error');
        this.name = type || 'RError';
        if (stack && typeof stack === 'string' || Array.isArray(stack)) {
            this.stack = Array.isArray(stack) ? stack.join('\n') : stack;
        }
        else {
            Error.captureStackTrace(this, SError);
        }
    }
};