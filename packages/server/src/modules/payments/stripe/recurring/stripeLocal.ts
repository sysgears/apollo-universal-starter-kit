import log from '../../../../../../common/log';
import settings from '../../../../../../../settings';

export default () => {
  let running = false;
  const { enabled, secretKey, webhookUrl } = settings.payments.stripe.recurring;

  return async (req: any, res: any, next: () => void) => {
    if (running) {
      next();
      return;
    }
    // TODO: fix error - Cannot find name '__SERVER_PORT__'.
    if (__DEV__ && enabled && secretKey && !running) {
      log.debug('Starting stripe local proxy');
      require('stripe-local')({
        secretKey,
        webhookUrl: `http://localhost:${__SERVER_PORT__}${webhookUrl}`
      });

      running = true;
    }
    next();
  };
};
