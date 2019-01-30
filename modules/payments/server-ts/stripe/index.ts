import ServerModule from '@gqlapp/module-server-ts';

import stripeSubscription from './subscription';

export default new ServerModule(stripeSubscription);
