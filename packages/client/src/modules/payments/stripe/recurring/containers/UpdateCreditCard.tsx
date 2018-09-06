import React from 'react';
import { Mutation } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';

import UpdateCreditCardView from '../components/UpdateCreditCardView';

import UPDATE_CREDIT_CARD from '../graphql/UpdateCreditCard.graphql';
import CREDIT_CARD_QUERY from '../graphql/CreditCardQuery.graphql';

import settings from '../../../../../../../../settings';
import translate, { TranslateFunction } from '../../../../../i18n';
import { PLATFORM } from '../../../../../../../common/utils';

interface UpdateCreditCardProps {
  t: TranslateFunction;
  history: any; // TODO: write types
  navigation: any;
}

// react-stripe-elements will not render on the server.
class UpdateCreditCard extends React.Component<UpdateCreditCardProps> {
  public onSubmit = (updateCard: any) => async (subscriptionInput: any) => {
    const {
      data: { updateStripeSubscriptionCard }
    } = await updateCard({ variables: { input: subscriptionInput } });
    const { t, history } = this.props;

    if (!updateStripeSubscriptionCard) {
      return { errors: ['Error updating card.'] };
    }

    // TODO: Implement error handling
    // if (result.errors) {
    //   const submitError = {
    //     _error: t('update.errorMsg')
    //   };
    //   result.errors.map((error: any) => (submitError[error.field] = error.message));
    //   throw submitError;
    // }

    if (history) {
      history.push('/profile');
    }
  };

  public render() {
    const { t } = this.props;
    return (
      <Mutation mutation={UPDATE_CREDIT_CARD} refetchQueries={[{ query: CREDIT_CARD_QUERY }]}>
        {updateCard => {
          return (
            <div>
              {__CLIENT__ && PLATFORM === 'web' ? (
                <StripeProvider apiKey={settings.payments.stripe.recurring.publicKey}>
                  <UpdateCreditCardView onSubmit={this.onSubmit(updateCard)} t={t} />
                </StripeProvider>
              ) : (
                <UpdateCreditCardView onSubmit={this.onSubmit(updateCard)} t={t} />
              )}
            </div>
          );
        }}
      </Mutation>
    );
  }
}

// const UpdateCreditCardWithApollo = compose(
//   graphql(UPDATE_CREDIT_CARD, {
//     props: ({ ownProps: { history }, mutate }) => ({
//       updateCard: async ({ token, expiryMonth, expiryYear, last4, brand }) => {
//         try {
//           const {
//             data: { updateStripeSubscriptionCard }
//           } = await mutate({
//             variables: { input: { token, expiryMonth, expiryYear, last4, brand } },
//             refetchQueries: [{ query: CREDIT_CARD_QUERY }]
//           });
//
//           if (!updateStripeSubscriptionCard) {
//             return { errors: ['Error updating card.'] };
//           }
//
//           if (history) {
//             history.push('/profile');
//           }
//           return updateStripeSubscriptionCard;
//         } catch (e) {
//           console.log(e.graphQLErrors);
//         }
//       }
//     })
//   }),
//   translate('subscription')
// )(UpdateCreditCard);

export default translate('subscription')(UpdateCreditCard);
