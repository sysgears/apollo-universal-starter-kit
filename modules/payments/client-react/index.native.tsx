import ClientModule from '@gqlapp/module-client-react-native';

import stripe from './stripe';

export { default as StripeSubscriptionProfile } from './stripe/subscription/containers/SubscriptionProfile';

export default new ClientModule(stripe);
