import { expect } from 'chai';
import { step } from 'mocha-steps';

import Renderer from '../../../testHelpers/Renderer';
import { updateContent } from '../../../testHelpers/testUtils';

describe('$Module$ UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('$Module$ page renders on mount', () => {
    app = renderer.mount();
    renderer.history.push('/$Module$');
    content = updateContent(app.container);
    expect(content).to.not.be.empty;
  });
});