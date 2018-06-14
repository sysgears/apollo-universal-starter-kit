import i18n from 'i18n';

import settings from '../../../../../settings';

export default (language = i18n.getLocale(), moduleName, messageKey) => {
  console.log('CURRENT_LOCALE', i18n.getLocale());
  const clientLanguage = language.split('-')[0]; // Supports both options 'en' and 'en-US'
  const translation = i18n.getCatalog(clientLanguage)[moduleName][messageKey];

  if (!translation) {
    return i18n.getCatalog(settings.i18n.fallbackLng)[moduleName][messageKey];
  }

  return translation;
};
