/**
 * @fileoverview No exteral imports outside specific module.
 * @author SysGears INC
 */
'use strict';
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var rule = require('../../../lib/rules/no-external-imports'),
  RuleTester = require('eslint').RuleTester;

// RuleTester.setDefaultConfig({
//   parserOptions: {
//     ecmaVersion: 6,
//     sourceType: 'module'
//   }
// });
var path = require('path');

function testFilePath(relativePath) {
  return path.join(__dirname, '../files/no-external-imports/default/modules/test-module-1/client-react', relativePath);
}

// const packagetestModule2 = path.join(
//   __dirname,
//   '../../files/no-external-imports/default/modules/test-module-2/client-react'
// );

const FILENAME = testFilePath('foo.js');
function test(t) {
  return Object.assign(
    {
      filename: FILENAME
    },
    t,
    {
      parserOptions: Object.assign(
        {
          sourceType: 'module',
          ecmaVersion: 6
        },
        t.parserOptions
      )
    }
  );
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-external-imports', rule, {
  valid: [test({ code: 'import "lodash.cond"' })],

  invalid: [
    test({
      code: 'import "not-a-dependency"',
      errors: [
        {
          ruleId: 'no-extraneous-dependencies',
          message:
            "'not-a-dependency' should be listed in the project's dependencies. Run 'npm i -S not-a-dependency' to add it"
        }
      ]
    })
  ]
});
