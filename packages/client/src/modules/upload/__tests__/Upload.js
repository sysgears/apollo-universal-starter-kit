// General imports
import { expect } from 'chai';
import { step } from 'mocha-steps';

// Components and helpers
import Renderer from '../../../testHelpers/Renderer';
import { updateContent } from '../../../testHelpers/testUtils';

describe('Upload UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('Upload page renders on mount', () => {
    app = renderer.mount();
    renderer.history.push('/upload');
    content = updateContent(app.container);
    expect(content).to.not.be.empty;
  });
});
