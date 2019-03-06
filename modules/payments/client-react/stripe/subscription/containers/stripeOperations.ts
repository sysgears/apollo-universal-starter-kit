import { isEmpty } from 'lodash';
import settings from '../../../../../../settings';
import { CreditCardInput } from '../types';

/**
 * Sends the request to the Stripe api for creating credit card token.
 * This method was created to work correctly on the mobile platforms, because stripe elements designed for web only
 * and not supported on the mobile devices.
 *
 * @param creditCardInput - The credit card data.
 *
 * @return - Returns promise with the Stripe data
 */
export const createToken = (creditCardInput: CreditCardInput) => {
  const card = {
    'card[number]': creditCardInput.values.number.replace(/ /g, ''),
    'card[exp_month]': creditCardInput.values.expiry.split('/')[0],
    'card[exp_year]': creditCardInput.values.expiry.split('/')[1],
    'card[cvc]': creditCardInput.values.cvc
  };

  return fetch('https://api.stripe.com/v1/tokens', {
    headers: {
      Accept: 'application/json',
      'Content-Type': ' application/x-www-form-urlencoded',
      Authorization: `Bearer ${settings.stripe.subscription.publicKey}`
    },
    method: 'post',
    body: Object.keys(card)
      .map(key => key + '=' + card[key])
      .join('&')
  }).then(response => response.json());
};

/**
 * Creates stripe credit card token.
 * Selects the way of creating the token:
 *  - using stripe library, if exists (for web)
 *  - manually, using fetch (for mobile)
 *
 * @param creditCardInput - The credit card data.
 * @param stripe - The stripe.
 *
 * @return - Returns credit card with the token or error
 */

export const createCreditCardToken = async (creditCardInput: CreditCardInput, stripe: any) => {
  const { name } = creditCardInput;
  let stripeResponse;

  if (stripe) {
    const { token, error } = await stripe.createToken({ name });
    if (!isEmpty(error)) {
      throw error;
    }
    stripeResponse = { id: token.id, card: token.card };
  } else {
    stripeResponse = await createToken(creditCardInput);
  }

  return {
    token: stripeResponse.id,
    expiryMonth: stripeResponse.card.exp_month,
    expiryYear: stripeResponse.card.exp_year,
    last4: stripeResponse.card.last4,
    brand: stripeResponse.card.brand
  };
};
