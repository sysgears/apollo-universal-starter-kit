import ServerCounter from './containers/ServerCounter';
import resources from './locales';
import Feature from '../../connector';

export default new Feature({
  localization: { ns: 'serverCounter', resources }
});

export { ServerCounter };
