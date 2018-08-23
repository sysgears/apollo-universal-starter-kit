export default {
  enabled: false,
  webhookUrl: '/stripe/webhook',
  stripePublishableKey: '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeEndpointSecret: process.env.STRIPE_ENDPOINT_SECRET
};
