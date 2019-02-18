import ServerModule from '@gqlapp/module-server-ts';
import stripe from './stripe';

export default new ServerModule(stripe);
