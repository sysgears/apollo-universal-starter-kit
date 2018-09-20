export default {
  stripe: {
    subscription: {
      enabled: true,
      webhookUrl: '/stripe/webhook',
      publicKey: '', // <-Public key
      secretKey: process.env.STRIPE_SECRET_KEY,
      endpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
      // for initializing the Stripe
      product: {
        name: 'Magic number',
        type: 'service'
      },
      plan: {
        id: 'basic',
        nickname: 'Basic Plan',
        amount: 1000,
        interval: 'month',
        currency: 'usd'
      }
    }
  }
};
