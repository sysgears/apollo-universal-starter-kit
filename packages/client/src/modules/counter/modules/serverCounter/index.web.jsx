import resources from './locales/index';
import Feature from '../../../connector';

export default new Feature({
  localization: { ns: 'counter', resources }
});
