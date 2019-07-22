import { ApolloError } from 'apollo-client';
import { GraphQLError } from 'graphql';
import { expect } from 'chai';

import { FormError } from '../FormError';

describe('Class FormError works', () => {
  const passwordGraphQLError = new GraphQLError(
    'Failed valid user password',
    undefined,
    undefined,
    undefined,
    ['login'],
    undefined,
    {
      code: 'FAILED_PASSWORD',
      exception: {
        errors: { usernameOrEmail: 'Please enter a valid password.' },
        stacktrace: [
          'Error: Failed valid user password',
          '    at _callee2$ (~/apollo-universal-starter-kit/node_modules/@gqlapp/user-server-ts/auth/password/resolvers.js:29:1)',
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
  );
  const emailGraphQLError = new GraphQLError(
    'Failed valid user email',
    undefined,
    undefined,
    undefined,
    ['login'],
    undefined,
    {
      code: 'FAILED_EMAIL',
      exception: {
        errors: { email: 'E-mail already exists.' },
        stacktrace: [
          'Error: Failed reset email',
          '    at _callee2$ (~/apollo-universal-starter-kit/node_modules/@gqlapp/user-server-ts/auth/password/resolvers.js:29:1)',
          '    at tryCatch (~/apollo-universal-starter-kit/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:62:40)',
          '    at Generator.invoke [as _invoke] (~/apollo-universal-starter-kit/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:288:22)',
          '    at Generator.prototype.(anonymous function) [as next] (~/apollo-universal-starter-kit/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:114:21)',
          '    at asyncGeneratorStep (~/apollo-universal-starter-kit/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:24)',
          '    at _next (~/apollo-universal-starter-kit/node_modules/@babel/runtime/helpers/asyncToGenerator.js:25:9)'
        ]
      },
      locations: [{ line: 2, column: 3 }],
      message: 'Failed reset email',
      path: ['register']
    }
  );

  const apolloErrorWithNetworkError = new ApolloError({ networkError: new Error('Test networkError') });

  const apolloErrorWithGraphQLError = new ApolloError({
    graphQLErrors: [passwordGraphQLError],
    errorMessage: 'GraphQL error: Failed password'
  });

  const apolloErrorWithGraphQLErrors = new ApolloError({
    graphQLErrors: [passwordGraphQLError, emailGraphQLError],
    errorMessage: 'GraphQL error: Failed password and email'
  });

  const clientError = new Error('Test client Error');

  const messageForAlertForm = 'Test message';

  it('Class FormError works with networkError', () => {
    expect(() => new FormError(messageForAlertForm, apolloErrorWithNetworkError)).to.throw();
  });
  it('Class FormError works with one graphQLError', () => {
    const errors = new FormError(messageForAlertForm, apolloErrorWithGraphQLError).errors;
    expect(errors).to.have.all.keys('usernameOrEmail', 'errorMsg');
  });
  it('Class FormError works with two graphQLErrors', () => {
    const errors = new FormError(messageForAlertForm, apolloErrorWithGraphQLErrors).errors;
    expect(errors).to.have.all.keys('usernameOrEmail', 'email', 'errorMsg');
  });
  it('Class FormError works with client error', () => {
    expect(() => new FormError(messageForAlertForm, clientError)).to.throw();
  });
});
