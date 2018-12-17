import CommonModule from '@module/module-common';
import resources from './locales';

export { FormikMessageHandler } from './FormikMessageHandler';
export * from './validation';
export * from './FieldError';

export default new CommonModule({
  localization: [{ ns: 'validation', resources }]
});
