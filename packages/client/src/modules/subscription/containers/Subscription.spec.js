// General imports
import { expect } from 'chai';
import { step } from 'mocha-steps';

// Components and helpers
import settings from '../../../../../../settings';
import Renderer from '../../../testHelpers/Renderer';
import { updateContent, waitForElementRender } from '../../../testHelpers/testUtils';

const { enabled, stripePublishableKey } = settings.subscription;

if (enabled && stripePublishableKey !== '') {
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

  describe('Subscription UI works', () => {
    const renderer = new Renderer(mocks, {});
    let app;
    let content;

    step('Subscription page renders on mount', async () => {
      app = renderer.mount();
      await waitForElementRender(app.container, 'a[href="/subscribers-only"]');
      renderer.history.push('/subscription');
      content = updateContent(app.container);
      expect(content).to.not.be.empty;
    });
  });
}
