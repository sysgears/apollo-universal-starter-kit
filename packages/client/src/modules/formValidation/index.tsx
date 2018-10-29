import ClientModule from '../ClientModule';
import resources from './locales';

export default new ClientModule({
  localization: [{ ns: 'fieldValidation', resources }]
});
