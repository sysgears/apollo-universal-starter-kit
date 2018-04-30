import React from 'react';
import { graphql, compose } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';

import UpdateCardView from '../components/UpdateCardView';

import UPDATE_CARD from '../graphql/UpdateCard.graphql';
import CARD_INFO from '../graphql/CardInfoQuery.graphql';

import settings from '../../../../../../settings';

// react-stripe-elements will not render on the server.
class UpdateCard extends React.Component {
  render() {
    return (
      <div>
        {__CLIENT__ ? (
          <StripeProvider apiKey={settings.subscription.stripePublishableKey}>
            <UpdateCardView {...this.props} />
          </StripeProvider>
        ) : (
          <UpdateCardView {...this.props} />
        )}
      </div>
    );
  }
}

const UpdateCardWithApollo = compose(
  graphql(UPDATE_CARD, {
    props: ({ ownProps: { history }, mutate }) => ({
      updateCard: async ({ token, expiryMonth, expiryYear, last4, brand }) => {
        try {
          const {
            data: { updateCard }
          } = await mutate({
            variables: { input: { token, expiryMonth, expiryYear, last4, brand } },
            refetchQueries: [{ query: CARD_INFO }]
          });

          if (!updateCard) {
            return { errors: ['Error updating card.'] };
          }

          if (history) {
            history.push('/profile');
          }
          return updateCard;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(UpdateCard);

export default UpdateCardWithApollo;
