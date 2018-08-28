import log from '../../../../../../common/log';
import settings from '../../../../../../../settings';

export default () => {
  let running = false;
  const { enabled, stripeSecretKey, webhookUrl } = settings.payments.stripe.recurring;

  return async (req: any, res: any, next: () => void) => {
    if (running) {
      next();
      return;
    }

    if (__DEV__ && enabled && stripeSecretKey && !running) {
      log.debug('Starting stripe local proxy');
      require('stripe-local')({
        secretKey: stripeSecretKey,
        webhookUrl: `http://localhost:${__SERVER_PORT__}${webhookUrl}`
      });

      running = true;
    }
    next();
  };
};
