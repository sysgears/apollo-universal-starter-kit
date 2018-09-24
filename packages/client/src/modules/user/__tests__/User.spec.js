// General imports
import { expect } from 'chai';
import { step } from 'mocha-steps';

// Components and helpers
import Renderer from '../../../testHelpers/Renderer';
import { updateContent, waitForElementRender } from '../../../testHelpers/testUtils';

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
      };
    }
  })
};

describe('User UI works', () => {
  const renderer = new Renderer(mocks, {});
  let app;
  let content;

  step('User page renders on mount', async () => {
    app = renderer.mount();
    await waitForElementRender(app.container, 'a[href="/profile"]');
    renderer.history.push('/profile');
    content = updateContent(app.container);
    expect(content).to.not.be.empty;
  });
});
