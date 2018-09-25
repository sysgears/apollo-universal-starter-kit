export default {
  stripe: {
    subscription: {
      enabled: true,
      webhookUrl: '/stripe/webhook',
      publicKey: '', // Provide your publishable key
      secretKey: process.env.STRIPE_SECRET_KEY,
      endpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
      // Default Stripe product object
      product: {
        name: 'Magic number',
        type: 'service'
      },
      // Default Stripe plan object
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
