import * as styles from './styles/styles.scss';

import { Feature } from '../connector';

export const uiBootstrap = new Feature({
  stylesInsert: styles,
  stylesProvider: 'bootstrap'
});
