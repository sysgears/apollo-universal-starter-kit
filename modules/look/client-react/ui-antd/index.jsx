import ClientModule from '@gqlapp/module-client-react';
import { onAppCreate } from './components/NavBar';
import styles from './styles/styles.less';

export * from './components';

export default new ClientModule({
  onAppCreate: [onAppCreate],
  stylesInsert: [() => styles._getCss()]
});
