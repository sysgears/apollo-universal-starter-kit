import settings from '../../../../../../../../settings';

export const createCardTokenFromMobile = async (cardInfo: any) => {
  const card = {
    'card[number]': cardInfo.values.number.replace(/ /g, ''),
    'card[exp_month]': cardInfo.values.expiry.split('/')[0],
    'card[exp_year]': cardInfo.values.expiry.split('/')[1],
    'card[cvc]': cardInfo.values.cvc
  };

  const body = Object.keys(card)
    .map(key => key + '=' + card[key])
    .join('&');

  return fetch('https://api.stripe.com/v1/tokens', {
    headers: {
      Accept: 'application/json',
      'Content-Type': ' application/x-www-form-urlencoded',
      Authorization: `Bearer ${settings.payments.stripe.recurring.publicKey}`
    },
    method: 'post',
    body
  }).then(response => response.json());
};

export const createCreditCardToken = async (creditCardInput: any, stripe: any) => {
  const { name } = creditCardInput;

  if (stripe) {
    const { token, error } = await stripe.createToken({ name });

    if (error) {
      return; // TODO: ADD error
    }

    const { id, card } = token;
    const { exp_month, exp_year, last4, brand } = card;

    return { token: id, expiryMonth: exp_month, expiryYear: exp_year, last4, brand };
  } else {
    const { id, card, error } = await createCardTokenFromMobile(creditCardInput);
    if (error) {
      return; // TODO: ADD error
    }

    const { exp_month, exp_year, last4, brand } = card;
    return { token: id, expiryMonth: exp_month, expiryYear: exp_year, last4, brand };
  }
};
