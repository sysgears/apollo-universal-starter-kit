import i18n from 'i18n';

export default (language = i18n.getLocale(), moduleName, messageKey) => {
  const clientLanguage = language.split('-')[0]; // Supports both options 'en' and 'en-US'
  const translation = i18n.getCatalog(clientLanguage)[moduleName][messageKey];

  if (!translation) {
    throw new Error(
      `Translation by messageKey: ${messageKey} for the module: ${moduleName} has not been found! Please, add it.`
    );
  }

  return translation;
};
