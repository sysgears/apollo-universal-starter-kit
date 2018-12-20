import { expect } from 'chai';
import { step } from 'mocha-steps';
import { Renderer, updateContent } from '@module/testing-client-react';

describe('Page not found example UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('404 page renders with sample text', () => {
    app = renderer.mount();
    renderer.history.push('/non-existing-page');
    content = updateContent(app.container);
    expect(content.textContent).to.include('Page not found - 404');
  });
});
