import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import CancelSubscriptionView from '../components/CancelSubscriptionView';

import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';
import CARD_INFO from '../graphql/CardInfoQuery.graphql';
import CANCEL from '../graphql/CancelSubscription.graphql';

const CancelSubscription = ({ loading, active, cancel }) => {
  return <CancelSubscriptionView loading={__SERVER__ ? true : loading} active={active} cancel={cancel} />;
};

CancelSubscription.propTypes = {
  cancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  active: PropTypes.bool
};

const CancelSubscriptionWithApollo = compose(
  graphql(SUBSCRIPTION_QUERY, {
    // i'm not sure why but this query causes SSR to hang. it seems to have
    // to do with the fact that this query exists in other places in the tree.
    // possibly having to do with the query name, as if you duplicate the query
    // file and change the query name to `SubscriptionDataTwo`, then it works.
    // skipping for now on server.
    skip: __SERVER__,
    options: { fetchPolicy: 'network-only' },
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
          const {
            data: { cancel }
          } = await mutate({
            update: (store, { data: { cancel } }) => {
              const data = store.readQuery({ query: SUBSCRIPTION_QUERY });
              data.subscription = cancel;
              store.writeQuery({ query: SUBSCRIPTION_QUERY, data });
            },
            refetchQueries: [{ query: CARD_INFO }]
          });

          if (cancel.errors) {
            return { errors: cancel.errors.map(e => e.message).join('\n') };
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
