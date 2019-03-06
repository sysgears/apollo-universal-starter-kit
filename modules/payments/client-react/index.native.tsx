import ClientModule from '@gqlapp/module-client-react-native';

import stripe from './stripe';

export default new ClientModule(stripe);
