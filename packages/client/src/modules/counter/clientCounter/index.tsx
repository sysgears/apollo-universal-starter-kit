import resolvers from './resolvers';
import resources from './locales';
import ClientModule from '../../ClientModule';
import ClientCounter from './containers/ClientCounter';

export default new ClientModule({
  resolver: [resolvers],
  localization: [{ ns: 'clientCounter', resources }]
});

export { ClientCounter };
