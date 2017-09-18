import React from 'react';
import { render } from 'react-dom';
// Virtual module, see webpack-virtual-modules usage in webpack.run.js
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
import 'backend_reload';

import Main from './app/Main';
import log from '../common/log';

const root = document.getElementById('content');

if (__DEV__) {
  let frontendReloadCount = 0;

  render(<Main key={frontendReloadCount} />, root);

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

        render(<Main key={frontendReloadCount} />, root);
      } catch (err) {
        log(err.stack);
      }
    });
  }
} else {
  render(<Main />, root);
}
