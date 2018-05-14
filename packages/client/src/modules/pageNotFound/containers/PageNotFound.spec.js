import { expect } from 'chai';
import { step } from 'mocha-steps';

import Renderer from '../../../testHelpers/Renderer';

describe('Page not found example UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('404 page renders with sample text', () => {
    app = renderer.render();
    renderer.history.push('/non-existing-page');
    content = app.container.querySelector('#content');
    expect(content.textContent).to.include('Page not found - 404');
  });
});
