require('dotenv/config');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripeInit = async () => {
  try {
    const product = await stripe.products.create({
      name: 'Magic number',
      type: 'service'
    });

    await stripe.plans.create({
      nickname: 'Basic Plan',
      product: product.id,
      amount: 1000,
      interval: 'month',
      currency: 'usd',
      id: 'basic'
    });

    console.log('----------------------------------------------------------------------------------------------------');
    console.log('Basic Plan created.');
    console.log('Subscribers will be charged $10 a month.');
    console.log('You will need to configure a webhook endpoint manually in the Stripe interface when ready to deploy.');
    console.log('This webhook will enable automatic cancelation and automated emails about failed charges.');
    console.log('----------------------------------------------------------------------------------------------------');
  } catch (e) {
    console.log(e);
  }
};

stripeInit();
