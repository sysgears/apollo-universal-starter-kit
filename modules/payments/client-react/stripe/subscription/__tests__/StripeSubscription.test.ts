import { Renderer, updateContent, waitForElementRender } from '@gqlapp/testing-client-react';
import settings from '@gqlapp/config';

const { enabled, publicKey } = settings.stripe.subscription;

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
        __typename: 'User',
      };
    },
  }),
};

const itIfEnabled = enabled && !!publicKey ? test : test.skip;

describe('Stripe subscription UI works', () => {
  const renderer = new Renderer(mocks, {});

  itIfEnabled('Stripe subscription page renders on mount', async () => {
    const app = renderer.mount();

    await waitForElementRender(app.container, 'a[href="/subscriber-page"]');
    renderer.history.push('/add-subscription');
    // eslint-disable-next-line jest/no-standalone-expect
    expect(updateContent(app.container)).toBeDefined();
  });
});
