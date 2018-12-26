import CommonModule from '@module/module-common';
import resources from './locales';

export * from './validation';
export * from './FieldError';

export default new CommonModule({
  localization: [{ ns: 'validation', resources }]
});
