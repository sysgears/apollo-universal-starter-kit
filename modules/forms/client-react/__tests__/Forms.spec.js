import { expect } from 'chai';
import { step } from 'mocha-steps';

import { FormErrors } from '../FormErrors';

describe('Class FormErrors works', () => {
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
      }
    ]
  };
  const noGraphQLErrors = {
    type: 'FAILED_PASSWORD',
    message: 'Failed valid user password',
    errors: { usernameOrEmail: 'Please enter a valid password.' }
  };
  const messageForAlertForm = 'Test message';

  step('Get graphQLErrors', () => {
    const errors = new FormErrors(graphQLErrors, messageForAlertForm).errors;
    expect(errors).to.have.all.keys('usernameOrEmail', 'errorMsg');
  });
  step('Get no graphQLErrors', () => {
    const errors = new FormErrors(noGraphQLErrors, messageForAlertForm).errors;
    expect(Object.keys(errors)).to.have.lengthOf(1);
  });
});
