import { expect } from 'chai';
import { step } from 'mocha-steps';
import settings from '../../../../../../settings';
import { Renderer, updateContent, waitForElementRender } from '@module/testing-client-react';

const { enabled, publicKey } = settings.stripe.subscription;

if (enabled && !!publicKey) {
  const mocks = {
    Query: () => ({
      currentUser(): any {
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

      await waitForElementRender(app.container, 'a[href="/subscriber-page"]');
      renderer.history.push('/add-subscription');
      // tslint:disable:no-unused-expression
      expect(updateContent(app.container)).to.not.be.empty;
    });
  });
}
