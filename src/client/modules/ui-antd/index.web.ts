import * as styles from './styles/styles.scss';

import { Feature } from '../connector';

export const uiAntd = new Feature({
  stylesInsert: styles,
  stylesProvider: 'antd'
});
