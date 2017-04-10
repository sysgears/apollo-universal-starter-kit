import React from 'react';
import { render } from 'react-dom';
import Main from './app/main';
import log from '../common/log';
import { app as settings } from '../../package.json';

const root = document.getElementById('content');

if (__DEV__) {
  let frontendReloadCount = 0;
  let backendReloadCount = 0;

  render((
    <Main key={frontendReloadCount}/>
  ), root);

  if (module.hot) {
    module.hot.accept();

    module.hot.accept('./app/main', () => {
      try {
        log.debug("Reloading front-end");
        frontendReloadCount = (frontendReloadCount || 0) + 1;

        const mainModule = require("./app/main");
        const Main = mainModule.default;

        if (settings.frontendRefreshOnBackendChange &&
            backendReloadCount !== mainModule.backendReloadCount) {
          backendReloadCount = mainModule.backendReloadCount;
          window.location.reload();
        }

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
