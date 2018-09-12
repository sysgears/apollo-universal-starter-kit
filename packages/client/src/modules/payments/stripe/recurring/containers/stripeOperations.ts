import settings from '../../../../../../../../settings';

/**
 * Sends request for creating credit card token to the Stripe.
 * This method was create to provide right working on the mobile platforms, because stripe-elements (web) are not
 * supported on the mobile devices.
 *
 * @param cardInfo - The credit card.
 *
 * @return - Returns promise with the Stripe data
 */
export const sendRequestFromMobile = async (cardInfo: any) => {
  const card = {
    'card[number]': cardInfo.values.number.replace(/ /g, ''),
    'card[exp_month]': cardInfo.values.expiry.split('/')[0],
    'card[exp_year]': cardInfo.values.expiry.split('/')[1],
    'card[cvc]': cardInfo.values.cvc
  };

  return fetch('https://api.stripe.com/v1/tokens', {
    headers: {
      Accept: 'application/json',
      'Content-Type': ' application/x-www-form-urlencoded',
      Authorization: `Bearer ${settings.payments.stripe.recurring.publicKey}`
    },
    method: 'post',
    body: Object.keys(card)
      .map(key => key + '=' + card[key])
      .join('&')
  }).then(response => response.json());
};

// TODO: check the comments on mistakes
/**
 * Creates stripe credit card token, chooses how to send request depends of platform.
 *
 * @param creditCardInput - The credit card info.
 * @param stripe - The stripe.
 *
 * @return - Returns credit card with the token or error
 */

// TODO: add types
export const createCreditCardToken = async (creditCardInput: any, stripe: any) => {
  const { name } = creditCardInput;
  let stripeResponse;

  if (stripe) {
    const { token, error } = await stripe.createToken({ name });
    stripeResponse = { id: token.id, card: token.card, error };
  } else {
    stripeResponse = await sendRequestFromMobile(creditCardInput);
  }

  // TODO: check errors
  return stripeResponse.error
    ? stripeResponse.error
    : {
        token: stripeResponse.id,
        expiryMonth: stripeResponse.card.exp_month,
        expiryYear: stripeResponse.card.exp_year,
        last4: stripeResponse.card.last4,
        brand: stripeResponse.card.brand
      };
};
