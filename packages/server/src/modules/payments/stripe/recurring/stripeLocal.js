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
      log.debug('Starting stripe local proxy');
      require('stripe-local')({
        secretKey: settings.subscription.stripeSecretKey,
        webhookUrl: `http://localhost:${__SERVER_PORT__}${settings.subscription.webhookUrl}`
      });

      running = true;
    }
    next();
  };
};
