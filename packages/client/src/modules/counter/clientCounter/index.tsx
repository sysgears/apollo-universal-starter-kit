import resolvers from './resolvers';
import resources from './locales';
import Feature from '../../connector';
import ClientCounter from './containers/ClientCounter';

export default new Feature({
  resolver: resolvers,
  localization: { ns: 'clientCounter', resources }
});

export { ClientCounter };
