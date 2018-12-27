import ServerModule from '@module/module-server-ts';

import { createServer } from './entry';

export { serverPromise } from './entry';

export default new ServerModule({});

export const runApp = (modules: ServerModule, entryModule: NodeModule) => {
  modules.createApp(entryModule);
  createServer(modules, entryModule);
};
