import React from 'react';
import { StyleSheet, View } from 'react-native';
// @ts-ignore
import { CreditCardInput } from 'react-native-credit-card-input';

import { Button, primary } from '../../../../common/components/native';
import settings from '../../../../../../../../settings';

// TODO: translate
const SubscriptionCardFormView = ({ cardInfo, onSubmit, t, mobileStripe, validateCard, cardIsValid }: any) => (
  <View>
    <View>
      <CreditCardInput requiresName onChange={validateCard} />
    </View>
    <View style={styles.buttonWrapper}>
      <Button color={primary} disabled={!cardIsValid} onClick={() => createCardTokenFromMobile(onSubmit, cardInfo)}>
        Subscribe
      </Button>
    </View>
  </View>
);

const createCardTokenFromMobile = async (onSubmit: any, cardInfo: any) => {
  /**
   * First create Stripe credit card token
   */

  const card = {
    'card[number]': cardInfo.values.number.replace(/ /g, ''),
    'card[exp_month]': cardInfo.values.expiry.split('/')[0],
    'card[exp_year]': cardInfo.values.expiry.split('/')[1],
    'card[cvc]': cardInfo.values.cvc
  };

  const body = Object.keys(card)
    .map(key => key + '=' + card[key])
    .join('&');

  try {
    const result = await fetch('https://api.stripe.com/v1/tokens', {
      headers: {
        Accept: 'application/json',
        'Content-Type': ' application/x-www-form-urlencoded',
        Authorization: `Bearer ${settings.payments.stripe.recurring.publicKey}`
      },
      method: 'post',
      body
    }).then(response => response.json());

    /*check error*/
    // TODO: here is checking arrors

    const {
      id,
      card: { exp_month, exp_year, last4, brand },
      error
    } = result;

    onSubmit({ token: id, expiryMonth: exp_month, expiryYear: exp_year, last4, brand });

    // console.log('RESPONSE', result);
  } catch (e) {
    console.error('ERROR!!!!', e);
  }
};

const withMobileStripe = (Component: any) => {
  return class MobileStripe extends React.Component<any, any> {
    constructor(props: any) {
      super(props);
      this.state = {
        cardIsValid: false,
        cardInfo: {}
      };
    }

    public validateCard = (cardInfo: any) => {
      this.setState({
        cardInfo,
        cardIsValid: cardInfo.valid
      });
    };

    public render() {
      return (
        <Component
          {...this.props}
          cardInfo={this.state.cardInfo}
          cardIsValid={this.state.cardIsValid}
          validateCard={this.validateCard}
        />
      );
    }
  };
};

export default withMobileStripe(SubscriptionCardFormView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  buttonWrapper: {
    padding: 10,
    zIndex: 100
  }
});
