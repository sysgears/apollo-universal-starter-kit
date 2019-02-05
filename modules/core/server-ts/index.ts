import ServerModule from '@gqlapp/module-server-ts';

import { createServer } from './entry';

export { serverPromise } from './entry';

export { default as schemas } from './generatedSchemas';

export default new ServerModule({
  onAppCreate: [createServer]
});
