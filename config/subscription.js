export default {
  enabled: true,
  webhookUrl: '/stripe/webhook',
  stripePublishableKey: 'pk_test_ww70oUQ44vVJ3HO4AnvglxCp',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeEndpointSecret: process.env.STRIPE_ENDPOINT_SECRET
};
