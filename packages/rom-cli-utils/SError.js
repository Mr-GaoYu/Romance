module.exports = class SError extends Error {
  constructor(msg, type, stack) {
      super(msg || 'San error');
      this.name = type || 'SError';
      if (stack && typeof stack === 'string' || Array.isArray(stack)) {
          this.stack = Array.isArray(stack) ? stack.join('\n') : stack;
      }
      else {
          Error.captureStackTrace(this, SError);
      }

  }
};

new module.exports()