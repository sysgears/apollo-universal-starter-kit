// General imports
import { expect } from 'chai';

// Components and helpers
import { Renderer, updateContent, waitForElementRender } from '@gqlapp/testing-client-react';

const mocks = {
  Query: () => ({
    currentUser() {
      return {
        id: 1,
        username: 'user',
        role: 'user',
        isActive: true,
        email: 'user@example.com',
        profile: null,
        auth: null,
        __typename: 'User'
      } as any;
    }
  })
};

describe('User UI works', () => {
  const renderer = new Renderer(mocks, {});
  let app;
  let content;

  it('User page renders on mount', async () => {
    app = renderer.mount();
    renderer.history.push('/profile');
    await waitForElementRender(app.container, 'a[href="/profile"]');
    content = updateContent(app.container);
    // tslint:disable-next-line:no-unused-expression
    expect(content).to.not.be.empty;
  });
});
