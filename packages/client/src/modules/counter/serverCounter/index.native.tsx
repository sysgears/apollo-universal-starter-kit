import ServerCounter from './containers/ServerCounter';
import resources from './locales';
import ClientModule from '../../ClientModule';

export default new ClientModule({
  localization: [{ ns: 'serverCounter', resources }]
});

export { ServerCounter };
