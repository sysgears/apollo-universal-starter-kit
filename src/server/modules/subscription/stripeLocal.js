import log from '../../../common/log';
import settings from '../../../../settings';

export default () => {
  let enabled = false;
  return async (req, res, next) => {
    if (enabled) {
      next();
      return;
    }
    if (__DEV__ && settings.subscription.enabled && !enabled) {
      log('Starting stripe local proxy');
      require('stripe-local')({
        secretKey: settings.subscription.stripeSecretKey,
        webhookUrl: 'http://localhost:3000/stripe/webhook'
      });
      enabled = true;
    }
    next();
  };
};
