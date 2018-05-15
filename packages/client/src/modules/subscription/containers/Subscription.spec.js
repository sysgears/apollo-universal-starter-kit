// General imports
import { expect } from 'chai';
import { step } from 'mocha-steps';

// Components and helpers
import Renderer from '../../../testHelpers/Renderer';
import { updateContent } from '../../../testHelpers/testUtils';

describe('Subscription UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('Subscription page renders on mount', () => {
    app = renderer.render();
    renderer.history.push('/subscription');
    content = updateContent(app.container);
    expect(content).to.not.be.empty;
  });
});
