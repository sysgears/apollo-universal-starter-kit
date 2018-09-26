import React from 'react';

import SubscriptionProfileView from '../components/SubscriptionProfileView';
import translate from '../../../../../i18n';
import { withStripeSubscription } from './withStripeSubscription';

const SubscriptionProfile = (props: any) => <SubscriptionProfileView {...props} />;

export default translate('stripeSubscription')(withStripeSubscription(SubscriptionProfile));
