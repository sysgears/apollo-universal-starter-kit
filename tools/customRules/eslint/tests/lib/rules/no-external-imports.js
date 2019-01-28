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
    ecmaFeatures: {
      jsx: true
    }
  }
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-external-imports', rule, {
  valid: [
    {
      code: '<button className="btn"></button>'
    }
  ],
  invalid: [
    {
      code: '<button></button>',
      errors: [
        {
          message: 'Buttons must be styled with a btn class at least.',
          type: 'JSXOpeningElement'
        }
      ]
    }
  ]
});
