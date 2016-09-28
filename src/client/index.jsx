import React from 'react'
import { render } from 'react-dom'
import Main from './main';
import router from '../routes'
import log from '../log';

const root = document.getElementById('content');

if (__DEV__) {
  const AppContainer = require('react-hot-loader').AppContainer;

  render((
      <AppContainer>
        <Main router={router}/>
      </AppContainer>
  ), root);

  if (module.hot) {
    module.hot.accept();

    module.hot.accept('./main', () => {
      try {
        render((
          <AppContainer>
            <Main/>
          </AppContainer>
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
