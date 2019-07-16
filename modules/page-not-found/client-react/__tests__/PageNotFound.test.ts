import { expect } from 'chai';
import { Renderer, updateContent, waitForElementRender } from '@gqlapp/testing-client-react';

describe('Page not found example UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  it('404 page renders with sample text', async () => {
    app = renderer.mount();
    renderer.history.push('/non-existing-page');
    await waitForElementRender(app.container, 'a[href="/"]');
    content = updateContent(app.container);
    expect(content.textContent).to.include('Page not found - 404');
  });
});
