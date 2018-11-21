const path = require('path');

module.exports = {
  "extends": "../../../.eslintrc.base.json",
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": path.join(__dirname, '../../../packages/client/webpack.config.lint.js')
      }
    }
  }
}