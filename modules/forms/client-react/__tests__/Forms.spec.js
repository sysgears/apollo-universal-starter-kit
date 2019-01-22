import { expect } from 'chai';
import { step } from 'mocha-steps';

import { FormErrors } from '../FormErrors';

describe('Class FormErrors works', () => {
  const graphQLError = {
    graphQLErrors: [
      {
        extensions: {
          code: 'FAILED_PASSWORD',
          exception: {
            errors: { usernameOrEmail: 'Please enter a valid password.' },
            stacktrace: [
              'Error: Failed valid user password',
              '    at _callee2$ (~/apollo-universal-starter-kit/node_modules/@module/user-server-ts/auth/password/resolvers.js:29:1)',
              '    at tryCatch (~/apollo-universal-starter-kit/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:62:40)',
              '    at Generator.invoke [as _invoke] (~/apollo-universal-starter-kit/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:288:22)',
              '    at Generator.prototype.(anonymous function) [as next] (~/apollo-universal-starter-kit/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:114:21)',
              '    at asyncGeneratorStep (~/apollo-universal-starter-kit/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:24)',
              '    at _next (~/apollo-universal-starter-kit/node_modules/@babel/runtime/helpers/asyncToGenerator.js:25:9)'
            ]
          },
          locations: [{ line: 2, column: 3 }],
          message: 'Failed valid user password',
          path: ['login']
        }
      }
    ]
  };

  const graphQLErrors = {
    graphQLErrors: [
      {
        extensions: {
          code: 'FAILED_PASSWORD',
          exception: {
            errors: { usernameOrEmail: 'Please enter a valid password.' },
            stacktrace: [
              'Error: Failed valid user password',
              '    at _callee2$ (~/apollo-universal-starter-kit/node_modules/@module/user-server-ts/auth/password/resolvers.js:29:1)',
              '    at tryCatch (~/apollo-universal-starter-kit/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:62:40)',
              '    at Generator.invoke [as _invoke] (~/apollo-universal-starter-kit/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:288:22)',
              '    at Generator.prototype.(anonymous function) [as next] (~/apollo-universal-starter-kit/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:114:21)',
              '    at asyncGeneratorStep (~/apollo-universal-starter-kit/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:24)',
              '    at _next (~/apollo-universal-starter-kit/node_modules/@babel/runtime/helpers/asyncToGenerator.js:25:9)'
            ]
          },
          locations: [{ line: 2, column: 3 }],
          message: 'Failed valid user password',
          path: ['login']
        }
      },
      {
        extensions: {
          code: 'FAILED_PASSWORD',
          exception: {
            errors: { email: 'E-mail already exists.' },
            stacktrace: [
              'Error: Failed valid user password',
              '    at _callee2$ (~/apollo-universal-starter-kit/node_modules/@module/user-server-ts/auth/password/resolvers.js:29:1)',
              '    at tryCatch (~/apollo-universal-starter-kit/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:62:40)',
              '    at Generator.invoke [as _invoke] (~/apollo-universal-starter-kit/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:288:22)',
              '    at Generator.prototype.(anonymous function) [as next] (~/apollo-universal-starter-kit/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:114:21)',
              '    at asyncGeneratorStep (~/apollo-universal-starter-kit/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:24)',
              '    at _next (~/apollo-universal-starter-kit/node_modules/@babel/runtime/helpers/asyncToGenerator.js:25:9)'
            ]
          },
          locations: [{ line: 2, column: 3 }],
          message: 'Failed reset password',
          path: ['register']
        }
      }
    ]
  };

  const clientError = [
    {
      type: 'FAILED_PASSWORD',
      message: 'Failed valid user password',
      errors: { test: 'Please enter a valid password.' }
    }
  ];
  const messageForAlertForm = 'Test message';

  step('Class FormErrors works with one graphQLError', () => {
    const errors = new FormErrors(messageForAlertForm, graphQLError).errors;
    expect(errors).to.have.all.keys('usernameOrEmail', 'errorMsg');
  });
  step('Class FormErrors works with two graphQLErrors', () => {
    const errors = new FormErrors(messageForAlertForm, graphQLErrors).errors;
    expect(errors).to.have.all.keys('usernameOrEmail', 'email', 'errorMsg');
  });
  step('Class FormErrors works with client error', () => {
    expect(() => new FormErrors(messageForAlertForm, clientError)).to.throw();
  });
});
