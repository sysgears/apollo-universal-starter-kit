import ServerModule from '@module/module-server-ts';

import { createServer, onAppDispose } from './entry';

export { serverPromise } from './entry';

export default new ServerModule({
  onAppCreate: [createServer],
  onAppDispose: [onAppDispose]
});
