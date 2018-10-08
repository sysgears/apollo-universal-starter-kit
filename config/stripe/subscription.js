export default {
  enabled: true,
  webhookUrl: '/stripe/webhook',
  publicKey: process.env.STRIPE_PUBLIC_KEY, // or 'your-public-key', for development
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
};
