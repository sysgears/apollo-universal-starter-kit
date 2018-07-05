import * as React from 'react';
import { hydrate, render } from 'react-dom';

// Virtual module, generated in-memory by spinjs, contains count of backend rebuilds
// tslint:disable-next-line
import 'backend_reload';

import log from '../../common/log';
import Main from './app/Main';

const renderFunc = __SSR__ ? hydrate : render;
const root = document.getElementById('root');

let frontendReloadCount = 0;

const renderApp = ({ key }: { key: number }) => renderFunc(<Main rootTag={root} key={key} />, root);

renderApp({ key: frontendReloadCount });

if (__DEV__) {
  if (module.hot) {
    module.hot.accept();

    module.hot.accept('backend_reload', () => {
      log.debug('Reloading front-end');
      window.location.reload();
    });

    module.hot.accept('./app/Main', () => {
      try {
        log.debug('Updating front-end');
        frontendReloadCount = (frontendReloadCount || 0) + 1;

        renderApp({ key: frontendReloadCount });
      } catch (err) {
        log(err.stack);
      }
    });
  }
}
