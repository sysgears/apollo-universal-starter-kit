import React from 'react';

import ClientModule from '@gqlapp/module-client-react';
import { onAppCreate } from './components/NavBar';
import MuiSSRProvider, { sheetsRegistry } from './ssr/muiSSRProvider';
import styles from './styles/styles.scss';

export * from './components';

export default new ClientModule({
  onAppCreate: [onAppCreate],
  // eslint-disable-next-line react/display-name
  rootComponentFactory: [() => <MuiSSRProvider />],
  // _getCss() method is going to be available during SSR build
  stylesInsert: [() => styles._getCss(), () => sheetsRegistry.toString()]
});
