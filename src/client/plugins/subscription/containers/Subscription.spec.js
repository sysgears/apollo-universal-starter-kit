// General imports
import { expect } from 'chai';
import { step } from 'mocha-steps';

// Components and helpers
import Renderer from '../../../../client/testHelpers/Renderer';
import Routes from '../../../../client/app/Routes';

describe('Subscription UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('Subscription page renders on mount', () => {
    app = renderer.mount(Routes);
    renderer.history.push('/subscription');
    content = app.find('#content');
    expect(content).to.not.be.empty;
  });
});
