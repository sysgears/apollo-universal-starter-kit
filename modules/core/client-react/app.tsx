import ClientModule from '@module/module-client-react';

// Virtual module, generated in-memory by spinjs, contains count of backend rebuilds
// tslint:disable-next-line
import 'backend_reload';

import log from '../../../packages/common/log';
import { onAppCreate } from './Main';

if (__DEV__) {
  if (module.hot) {
    module.hot.accept();

    module.hot.accept('backend_reload', () => {
      log.debug('Reloading front-end');
      window.location.reload();
    });
  }
}

export default new ClientModule({ onAppCreate: [onAppCreate] });
