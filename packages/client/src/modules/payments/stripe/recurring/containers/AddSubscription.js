import React from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { StripeProvider } from 'react-stripe-elements';

import AddSubscriptionView from '../components/AddSubscriptionView';

import ADD_SUBSCRIPTION from '../graphql/AddSubscription.graphql';
import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';
import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

import settings from '../../../../../../../../settings';

// react-stripe-elements will not render on the server.
class AddSubscription extends React.Component {
  static propTypes = {
    subscribe: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onSubmit = subscribe => async values => {
    const result = await subscribe(values);
    const { t } = this.props;

    if (result.errors) {
      let submitError = {
        _error: t('errorMsg')
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw submitError;
    }
  };

  render() {
    const { subscribe } = this.props;

    return (
      <div>
        {__CLIENT__ ? (
          <StripeProvider apiKey={settings.payments.stripe.recurring.publicKey}>
            <AddSubscriptionView onSubmit={this.onSubmit(subscribe)} {...this.props} />
          </StripeProvider>
        ) : (
          <AddSubscriptionView {...this.props} />
        )}
      </div>
    );
  }
}

const SubscriptionViewWithApollo = compose(
  graphql(ADD_SUBSCRIPTION, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      subscribe: async ({ token, expiryMonth, expiryYear, last4, brand }) => {
        try {
          const {
            data: { addStripeSubscription }
          } = await mutate({
            variables: { input: { token, expiryMonth, expiryYear, last4, brand } },
            update: (store, { data: { addStripeSubscription } }) => {
              const data = store.readQuery({ query: SUBSCRIPTION_QUERY });
              data.stripeSubscription = addStripeSubscription;
              store.writeQuery({ query: SUBSCRIPTION_QUERY, data });
            },
            refetchQueries: [{ query: CREDIT_CARD_QUERY }]
          });

          if (addStripeSubscription.errors) {
            return { errors: addStripeSubscription.errors };
          }

          if (history) {
            history.push('/subscribers-only');
          }
          if (navigation) {
            navigation.goBack();
          }

          return addStripeSubscription;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(AddSubscription);

export default SubscriptionViewWithApollo;
