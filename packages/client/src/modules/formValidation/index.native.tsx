import ClientModule from '../ClientModule.native';
import resources from './locales';

export default new ClientModule({
  localization: [{ ns: 'fieldValidation', resources }]
});
