import React from 'react';
import { Query } from 'react-apollo';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

import SubscriberPageView from '../components/SubscriberPageView';

import SUBSCRIBER_NUMBER_QUERY from '../graphql/SubscriptionProtectedNumberQuery.graphql';

const SubscriberPage = ({ t }: { t: TranslateFunction }) => (
  <Query query={SUBSCRIBER_NUMBER_QUERY} fetchPolicy="network-only">
    {({ loading, data }) => (
      <SubscriberPageView loading={loading} t={t} subscriberNumber={data.stripeSubscriptionProtectedNumber} />
    )}
  </Query>
);

export default translate('stripeSubscription')(SubscriberPage);
