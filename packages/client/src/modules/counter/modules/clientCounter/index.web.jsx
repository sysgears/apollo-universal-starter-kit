import resolvers from './resolvers/index';
import resources from './locales/index';
import Feature from '../../../connector';

export default new Feature({
  resolver: resolvers,
  localization: { ns: 'clientCounter', resources }
});
