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

// function testFilePath() {
//   return path.join(
//     __dirname,
//     '../../../../rules/no-external-imports/default/modules/test-module-1/client-react',
//     'foo.js'
//   );
// }

const packagetestModule1 = path.join(
  __dirname,
  '../../../../rules/no-external-imports/default/modules/test-module-1/client-react',
  'foo.js'
);

const packagetestModule2 = path.join(
  __dirname,
  '../../../../rules/no-external-imports/default/modules/test-module-2/client-react',
  'foo.js'
);
const packagetestModule3 = path.join(
  __dirname,
  '../../../../rules/no-external-imports/default/modules/test-module-3/client-react',
  'foo.js'
);

// const FILENAME = testFilePath();
function test(t) {
  return Object.assign(
    {
      filename: packagetestModule1
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
    test({ code: 'import { chalk } from "chalk"; import { tyop } from "safe"' }),
    test({
      code: 'import Module from "@modules/test-module-3-client-react"',
      filename: packagetestModule2
    }),
    test({
      code: 'import { Type } from "@types/humps"',
      filename: packagetestModule3
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
