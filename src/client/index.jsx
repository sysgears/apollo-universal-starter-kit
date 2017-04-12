import React from 'react';
import { render } from 'react-dom';
// Virtual module, see webpack-virtual-modules usage in webpack.run.js
import 'backend_reload'; // eslint-disable-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions

import Main from './main';
import log from '../log';
import { app as settings } from '../../package.json';

const root = document.getElementById('content');

if (__DEV__) {
  let frontendReloadCount = 0;

  render((
    <Main key={frontendReloadCount}/>
  ), root);

  if (module.hot) {
    module.hot.accept();

    if (settings.frontendRefreshOnBackendChange) {
      module.hot.accept('backend_reload', () => {
        log.debug("Reloading front-end");
        window.location.reload();
      });
    }

    module.hot.accept('./main', () => {
      try {
        log.debug("Updating front-end");
        frontendReloadCount = (frontendReloadCount || 0) + 1;

        const mainModule = require("./main");
        const Main = mainModule.default;

        render((
          <Main key={frontendReloadCount}/>
        ), root);
      } catch (err) {
        log(err.stack);
      }
    });
  }
} else {
  render((
    <Main/>
  ), root);
}
