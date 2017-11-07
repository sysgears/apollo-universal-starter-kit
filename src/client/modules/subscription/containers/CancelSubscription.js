import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import CancelSubscriptionView from '../components/CancelSubscriptionView';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';
import CANCEL from '../graphql/CancelSubscription.graphql';

const CancelSubscription = ({ loading, active, cancel }) => {
  return <CancelSubscriptionView loading={loading} active={active} cancel={cancel} />;
};

CancelSubscription.propTypes = {
  cancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  active: PropTypes.bool
};

const CancelSubscriptionWithApollo = compose(
  graphql(SUBSCRIPTION_QUERY, {
    props({ data: { loading, subscription } }) {
      return {
        loading,
        active: subscription && subscription.active
      };
    }
  }),
  graphql(CANCEL, {
    props: ({ mutate }) => ({
      cancel: async () => {
        try {
          const { data: { cancel } } = await mutate({
            update: (store, { data: { cancel } }) => {
              const data = store.readQuery({ query: SUBSCRIPTION_QUERY });
              data.subscription = cancel;
              store.writeQuery({ query: SUBSCRIPTION_QUERY, data });
            }
          });

          if (cancel.errors) {
            return { errors: cancel.errors };
          }

          return true;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(CancelSubscription);

export default CancelSubscriptionWithApollo;
