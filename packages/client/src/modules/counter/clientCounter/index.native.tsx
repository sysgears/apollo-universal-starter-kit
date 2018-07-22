import ClientCounter from './containers/ClientCounter';
import resolvers from './resolvers';
import resources from './locales';
import Feature from '../../connector';

export default new Feature({
  resolver: resolvers,
  localization: { ns: 'clientCounter', resources }
});

export { ClientCounter };
