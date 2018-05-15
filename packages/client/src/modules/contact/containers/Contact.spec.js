import { expect } from 'chai';
import { step } from 'mocha-steps';

import Renderer from '../../../../src/testHelpers/Renderer';
import { updateContent } from '../../../testHelpers/testUtils';
import Routes from '../../../../src/app/Routes';

describe('Contact UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('Contact page renders on mount', () => {
    app = renderer.render(Routes);
    renderer.history.push('/contact');
    content = updateContent(app.container);
    expect(content).to.not.be.empty;
  });
});
