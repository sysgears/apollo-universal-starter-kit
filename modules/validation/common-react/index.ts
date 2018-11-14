import CommonModule from '@module/module';
import resources from './locales';

export * from './validation';

export default new CommonModule({
  localization: [{ ns: 'validation', resources }]
});
