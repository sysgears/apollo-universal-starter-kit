import CommonModule from '../CommonModule';
import resources from './locales';

export * from './validation';

export default new CommonModule({
  localization: [{ ns: 'validation', resources }]
});
