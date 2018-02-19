import * as React from 'react';
import * as RNW from 'react-native-web';
// Work around warning about React.hydrate during SSR
import AppContainer from 'react-native-web/dist/apis/AppRegistry/AppContainer';

// Virtual module, generated in-memory by spinjs, contains count of backend rebuilds
// tslint:disable-next-line
import 'backend_reload';

import log from '../../common/log';
import Main from './app/Main';

const renderFunc = __SSR__ ? RNW.hydrate : RNW.render;
const root = document.getElementById('content');

let frontendReloadCount = 0;

const renderApp = ({ key }: { key: number }) =>
  renderFunc(
    <AppContainer rootTag={root}>
      <Main key={key} />
    </AppContainer>,
    root
  );

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
