require('dotenv/config');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

stripe.plans.create(
  {
    amount: 1000,
    interval: 'month',
    name: 'Basic Plan',
    currency: 'usd',
    id: 'basic'
  },
  function(err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('Basic Plan created.');
    console.log('Subscribers will be charged $10 a month.');
    console.log('You will need to configure a webhook endpoint manually in the Stripe interface when ready to deploy.');
    console.log('This webhook will enable automatic cancelation and automated emails about failed charges.');
  }
);
