import ClientModule from '@gqlapp/module-client-react';
import { onAppCreate } from './components/NavBar';
import styles from './styles/styles.scss';

export * from './components';

export default new ClientModule({
  onAppCreate: [onAppCreate],
  stylesInsert: [[() => styles._getCss()]]
});
