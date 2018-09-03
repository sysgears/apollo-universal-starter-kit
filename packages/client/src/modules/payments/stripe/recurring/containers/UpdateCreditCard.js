import React from 'react';
import { graphql, compose } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';
import PropTypes from 'prop-types';

import UpdateCreditCardView from '../components/UpdateCreditCardView';

import UPDATE_CREDIT_CARD from '../graphql/UpdateCreditCard.graphql';
import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

import settings from '../../../../../../../../settings';
import translate from '../../../../../i18n';

// react-stripe-elements will not render on the server.
class UpdateCreditCard extends React.Component {
  static propTypes = {
    updateCard: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onSubmit = updateCard => async values => {
    const result = await updateCard(values);
    const { t } = this.props;

    if (result.errors) {
      let submitError = {
        _error: t('update.errorMsg')
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw submitError;
    }
  };

  render() {
    const { updateCard, t } = this.props;
    return (
      <div>
        {__CLIENT__ ? (
          <StripeProvider apiKey={settings.payments.stripe.recurring.publicKey}>
            <UpdateCreditCardView onSubmit={this.onSubmit(updateCard)} t={t} />
          </StripeProvider>
        ) : (
          <UpdateCreditCardView onSubmit={this.onSubmit(updateCard)} t={t} />
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
  }),
  translate('subscription')
)(UpdateCreditCard);

export default UpdateCreditCardWithApollo;
