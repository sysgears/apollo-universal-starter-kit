const fs = require('fs');
const path = require('path');

module.exports = {
  process: function() {
    const pathname = arguments[1];
    const dir = path.dirname(pathname);
    const locales = fs.readdirSync(dir);
    const result = {};
    for (const locale of locales) {
      if (fs.statSync(path.join(dir, locale)).isDirectory()) {
        const localeFiles = fs.readdirSync(path.join(dir, locale));
        for (const localeFile of localeFiles) {
          if (localeFile.indexOf('.json') >= 0) {
            result[locale] = JSON.parse(fs.readFileSync(path.join(dir, locale, localeFile), 'utf8'));
          }
        }
      }
    }
    return {
      code: `module.exports = ${JSON.stringify(result)};`
    };
  }
};
