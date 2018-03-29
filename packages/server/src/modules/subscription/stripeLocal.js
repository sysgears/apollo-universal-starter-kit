import log from '../../../../common/log';
import settings from '../../../../../settings';

export default () => {
  let running = false;
  return async (req, res, next) => {
    if (running) {
      next();
      return;
    }

    const { enabled, stripeSecretKey } = settings.subscription;

    if (__DEV__ && enabled && stripeSecretKey && !running) {
      log('Starting stripe local proxy');
      require('stripe-local')({
        secretKey: settings.subscription.stripeSecretKey,
        webhookUrl: `http://localhost:3000/stripe/webhook`
      });
      running = true;
    }
    next();
  };
};
