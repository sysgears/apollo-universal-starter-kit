import React from 'react';
import { render, hydrate } from 'react-native';
// Work around warning about React.hydrate during SSR
import AppContainer from 'react-native-web/dist/apis/AppRegistry/AppContainer';

// Virtual module, see webpack-virtual-modules usage in webpack.run.js
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
import 'backend_reload';

import Main from './app/Main';
import log from '../common/log';

const renderFunc = __SSR__ ? hydrate : render;
const root = document.getElementById('content');

let frontendReloadCount = 0;

const renderApp = props =>
  renderFunc(
    <AppContainer rootTag={root}>
      <Main {...props} />
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
