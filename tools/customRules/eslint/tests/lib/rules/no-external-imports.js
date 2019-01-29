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

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-external-imports', rule, {
  valid: ["import $ from 'jquery';", "import { filter } from 'lodash/fp'"],

  invalid: [
    {
      code: "import _ from 'lodash';",
      errors: [
        {
          message: 'Prefer importing single functions over a full FP library',
          type: 'ImportDeclaration'
        }
      ]
    }
  ]
});
