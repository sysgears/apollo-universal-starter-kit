import ClientCounter from './containers/ClientCounter';
import resolvers from './resolvers';
import resources from './locales';
import ClientModule from '../../ClientModule';

export default new ClientModule({
  resolver: [resolvers],
  localization: [{ ns: 'clientCounter', resources }]
});

export { ClientCounter };
