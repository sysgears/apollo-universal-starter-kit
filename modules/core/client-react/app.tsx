import * as React from 'react';
import { hydrate, render } from 'react-dom';

import ClientModule from '@gqlapp/module-client-react';
import { log } from '@gqlapp/core-common';

import { onAppCreate as onCreateMain, Main, onAppDispose } from './Main';

const renderFunc = __SSR__ ? hydrate : render;
const root = __TEST__ ? document.createElement('div') : document.getElementById('root');

let frontendReloadCount = 0;

const renderApp = ({ key }: { key: number }) => renderFunc(<Main rootTag={root} key={key} />, root);

const initWebpackHMR = (modules: ClientModule, entryModule: NodeModule) => {
  if (entryModule.hot) {
    entryModule.hot.dispose(data => onAppDispose(modules, data));
    if (__CLIENT__) {
      entryModule.hot.accept();
    }
    if (entryModule.hot.data) {
      log.debug('Updating front-end');
      frontendReloadCount = (frontendReloadCount || 0) + 1;
    }
  }
};

const onAppCreate = async (modules: ClientModule, entryModule: NodeModule) => {
  initWebpackHMR(modules, entryModule);
  onCreateMain(modules, entryModule);
  if (!__TEST__) {
    renderApp({ key: frontendReloadCount });
  }
};

if (__DEV__ && module.hot) {
  module.hot.accept();
}

export default new ClientModule({ onAppCreate: [onAppCreate] });
