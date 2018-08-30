import { expect } from 'chai';
import { step } from 'mocha-steps';

import settings from '../../../../../../../../settings';
import Renderer from '../../../../../testHelpers/Renderer';
import { updateContent, waitForElementRender } from '../../../../../testHelpers/testUtils';

const { enabled, piblicKey } = settings.payments.stripe.recurring;

if (enabled && piblicKey !== '') {
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

  describe('Stripe subscription UI works', () => {
    const renderer = new Renderer(mocks, {});

    step('Stripe subscription page renders on mount', async () => {
      const app = renderer.mount();
      await waitForElementRender(app.container, 'a[href="/subscribers-only"]');
      renderer.history.push('/subscription');
      expect(updateContent(app.container)).to.not.be.empty;
    });
  });
}
