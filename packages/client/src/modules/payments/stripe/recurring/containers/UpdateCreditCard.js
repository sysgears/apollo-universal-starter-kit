import React from 'react';
import { graphql, compose } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';

import UpdateCreditCardView from '../components/UpdateCreditCardView';

import UPDATE_CREDIT_CARD from '../graphql/UpdateCreditCard.graphql';
import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

import settings from '../../../../../../../../settings';

// react-stripe-elements will not render on the server.
class UpdateCreditCard extends React.Component {
  render() {
    return (
      <div>
        {__CLIENT__ ? (
          <StripeProvider apiKey={settings.payments.stripe.recurring.publicKey}>
            <UpdateCreditCardView {...this.props} />
          </StripeProvider>
        ) : (
          <UpdateCreditCardView {...this.props} />
        )}
      </div>
    );
  }
}

const UpdateCreditCardWithApollo = compose(
  graphql(UPDATE_CREDIT_CARD, {
    props: ({ ownProps: { history }, mutate }) => ({
      updateCard: async ({ token, expiryMonth, expiryYear, last4, brand }) => {
        try {
          const {
            data: { updateStripeSubscriptionCard }
          } = await mutate({
            variables: { input: { token, expiryMonth, expiryYear, last4, brand } },
            refetchQueries: [{ query: CREDIT_CARD_QUERY }]
          });

          if (!updateStripeSubscriptionCard) {
            return { errors: ['Error updating card.'] };
          }

          if (history) {
            history.push('/profile');
          }
          return updateStripeSubscriptionCard;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(UpdateCreditCard);

export default UpdateCreditCardWithApollo;
