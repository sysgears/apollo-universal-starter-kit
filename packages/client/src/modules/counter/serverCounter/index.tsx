import resources from './locales';
import Feature from '../../connector';
import ServerCounter from './containers/ServerCounter';

export default new Feature({
  localization: { ns: 'serverCounter', resources }
});

export { ServerCounter };
