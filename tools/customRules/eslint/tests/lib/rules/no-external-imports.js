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

var path = require('path');

const testPath = path.join(
  __dirname,
  '../../testArchitecture/no-external-imports/default/packages/client/container',
  'foo.js'
);

function test(t) {
  return Object.assign(
    {
      filename: testPath
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
  valid: [
    test({ code: 'import Module from "@modules/test-module-3-client-react"' }),
    test({ code: 'import Module2 from "test-module-2-client-react"' }),
    test({
      code: 'import Bla from "bla"'
    })
  ],

  invalid: [
    test({
      code: 'import value from "dependency"',
      errors: [
        {
          ruleId: 'no-extraneous-dependencies',
          message: "Can't find 'dependency' in the packages.json or in related module's package.json."
        }
      ]
    })
  ]
});
