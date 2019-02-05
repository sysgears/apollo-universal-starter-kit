const requireIndex = require('requireindex');

//in package json: "eslint-plugin-custom-rules": "file:./tools/customRules/eslint",
//in eslint.base: "custom-rules/no-external-imports": 0,
//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + '/rules');
