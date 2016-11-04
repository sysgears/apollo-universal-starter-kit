import React from 'react'
import { render } from 'react-dom'
import Main from './main'
import log from '../log'

const root = document.getElementById('content');

if (__DEV__) {
  let frontendReloadCount = 0;

  render((
    <Main key={frontendReloadCount}/>
  ), root);

  if (module.hot) {
    module.hot.accept();

    module.hot.accept('./main', () => {
      try {
        log.debug("Reloading front-end");
        frontendReloadCount = (frontendReloadCount || 0) + 1;

        const Main = require('./main').default;

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
