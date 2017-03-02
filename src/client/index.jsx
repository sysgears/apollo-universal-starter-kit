import React from 'react'
import { render } from 'react-dom'
import Main from './main'
import log from '../log'
import { app as settings } from '../../package.json'

const root = document.getElementById('content');

if (__DEV__) {
  let frontendReloadCount = 0;
  let backendReloadCount = 0;

  render((
    <Main key={frontendReloadCount}/>
  ), root);

  if (module.hot) {
    module.hot.accept();

    module.hot.accept('./main', () => {
      try {
        log.debug("Reloading front-end");
        frontendReloadCount = (frontendReloadCount || 0) + 1;
        // Force Apollo to fetch the latest data from the server
        delete window.__APOLLO_STATE__;

        const mainModule = require("./main");
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
