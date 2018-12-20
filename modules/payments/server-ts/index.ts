import ServerModule from '@module/module-server-ts';
import stripe from './stripe';

export default new ServerModule(stripe);
