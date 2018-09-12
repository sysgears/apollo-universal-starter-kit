/*tslint:disable:no-reference */
/// <reference path="../../../../../typings/typings.d.ts" />

import log from '../../../../../../common/log';
import settings from '../../../../../../../settings';

/**
 * Imitates events from the Stripe.
 * To imitate stripe events to our webhook, the 'stripe-local' library is used.
 */
export default () => {
  let running = false;
  const { enabled, secretKey, webhookUrl } = settings.payments.stripe.recurring;

  return async (req: any, res: any, next: () => void) => {
    if (running) {
      next();
      return;
    }

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
