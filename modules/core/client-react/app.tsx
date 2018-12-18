import * as React from 'react';
import { hydrate, render } from 'react-dom';
import ClientModule from '@module/module-client-react';

// Virtual module, generated in-memory by spinjs, contains count of backend rebuilds
// tslint:disable-next-line
import 'backend_reload';

import log from '../../../packages/common/log';
import { onAppCreate as onCreateMain, Main, onAppDispose } from './Main';

const renderFunc = __SSR__ ? hydrate : render;
const root = document.getElementById('root');

let frontendReloadCount = 0;

const renderApp = ({ key }: { key: number }) => renderFunc(<Main rootTag={root} key={key} />, root);

const onAppCreate = (modules: ClientModule, appReloaded: false) => {
  onCreateMain(modules);
  if (appReloaded) {
    log.debug('Updating front-end');
    frontendReloadCount = (frontendReloadCount || 0) + 1;
  }
  renderApp({ key: frontendReloadCount });
};

if (__DEV__) {
  if (module.hot) {
    module.hot.accept();

    module.hot.accept('backend_reload', () => {
      log.debug('Reloading front-end');
      window.location.reload();
    });
  }
}

export default new ClientModule({ onAppCreate: [onAppCreate], onAppDispose: [onAppDispose] });
