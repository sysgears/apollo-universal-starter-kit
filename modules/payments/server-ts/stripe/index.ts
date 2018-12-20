import ServerModule from '@module/module-server-ts';

import stripeSubscription from './subscription';

export default new ServerModule(stripeSubscription);
