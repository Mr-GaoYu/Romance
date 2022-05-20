const Handlebars = require('handlebars');
const setDelimiters = require('handlebars-delimiters');

Handlebars.registerHelper('if_eq', function (a, b, opts) {
  return a === b ? opts.fn(this) : opts.inverse(this);
});

Handlebars.registerHelper('unless_eq', function (a, b, opts) {
  return a === b ? opts.inverse(this) : opts.fn(this);
});

Handlebars.registerHelper('xif', function (expression, options) {
  return Handlebars.helpers['x'].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('x', function (expression, options) {
  let result;
  let context = this;
  with(context) {
    result = function () {
      try {
        return eval(expression);
      } catch (e) {
        console.warn("•Expression: {{x '" + expression + "'}}\n•JS-Error: ", e, '\n•Context: ', context);
      }
    }.call(context);
  }
  return result;
})

Handlebars.setDelimiters = function (delimiters) {
  if (!Array.isArray(delimiters) || delimiters.length !== 2) {
    console.warn('Handlebars Delimiters Settings Failed');
    return;
  }
  setDelimiters(Handlebars, [...delimiters]);
  Handlebars.delimiters = delimiters;
};


Handlebars.isHandlebarTPL = function (content, delimiters) {
  if (!content) {
    return false;
  }

  delimiters = delimiters || Handlebars.delimiters;

  if (!delimiters) {
    return /{{([^{}]+)}}/g.test(content);
  }

  const [startDelimiter, endDelimiter] = delimiters.map(
    t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  );

  return new RegExp(startDelimiter + '.*?' + endDelimiter, 'g').test(content);

}

module.exports = Handlebars;