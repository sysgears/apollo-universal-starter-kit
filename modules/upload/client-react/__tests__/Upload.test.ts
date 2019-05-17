// General imports
import { expect } from 'chai';
import { Renderer, updateContent } from '@gqlapp/testing-client-react';

describe('Upload UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  it('Upload page renders on mount', () => {
    app = renderer.mount();
    renderer.history.push('/upload');
    content = updateContent(app.container);
    // tslint:disable-next-line:no-unused-expression
    expect(content).to.not.be.empty;
  });
});
