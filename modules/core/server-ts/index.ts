import ServerModule from '@gqlapp/module-server-ts';

import { createServer } from './entry';

export { serverPromise } from './entry';
export { createSchema } from './api/schema';

export default new ServerModule({
  onAppCreate: [createServer],
});
