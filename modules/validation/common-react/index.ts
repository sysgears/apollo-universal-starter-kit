import CommonModule from '@module/module-common';
export * from './formikMessageHandler';
import resources from './locales';

// export { formikMessageHandler };
export * from './validation';
export * from './FieldError';

export default new CommonModule({
  localization: [{ ns: 'validation', resources }]
});
