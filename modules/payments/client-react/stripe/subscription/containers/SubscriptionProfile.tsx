import React from 'react';
import { translate } from '@gqlapp/i18n-client-react';

import SubscriptionProfileView from '../components/SubscriptionProfileView';
import { withStripeSubscription } from './withStripeSubscription';

const SubscriptionProfile = (props: any) => <SubscriptionProfileView {...props} />;

export default translate('stripeSubscription')(withStripeSubscription(SubscriptionProfile));
