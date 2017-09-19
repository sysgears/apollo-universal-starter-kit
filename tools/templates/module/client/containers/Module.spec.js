// General imports
import { expect } from 'chai';
import { step } from 'mocha-steps';

// Components and helpers
import ApolloRenderer from '../../../../client/testHelpers/ApolloRenderer';
import routes from '../../../../client/app/Routes';

describe('$Module$ UI works', () => {
  const renderer = new ApolloRenderer({});
  let app;
  let content;

  step('$Module$ page renders on mount', () => {
    app = renderer.mount(routes);
    renderer.history.push('/$Module$');
    content = app.find('#content');
    expect(content).to.not.be.empty;
  });
});
