import { PLATFORM } from '@module/core-common';
import ClientModule from '@module/module-client-react';
export { FieldAdapter, clientOnly } from './components';

export default (__CLIENT__ && PLATFORM === 'web' ? require('./app').default : {});

export const runApp = (modules: ClientModule, entryModule: NodeModule) => {
  modules.createApp(entryModule);
};
