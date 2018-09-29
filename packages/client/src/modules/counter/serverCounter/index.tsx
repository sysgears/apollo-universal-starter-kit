import resources from './locales';
import ClientModule from '../../ClientModule';
import ServerCounter from './containers/ServerCounter';

export default new ClientModule({
  localization: [{ ns: 'serverCounter', resources }]
});

export { ServerCounter };
