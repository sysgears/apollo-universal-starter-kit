import i18n from 'i18n';

import Feature from '../connector';

const initMiddleware = async (req, res, next) => {
  i18n.configure({
    locales: ['en', 'ru'],
    directory: process.cwd() + '/src/modules/i18n/locales',
    cookie: 'locale'
  });
  i18n.init();
  next();
};

const translator = (language = i18n.getLocale(), moduleName, messageKey) => {
  const clientLanguage = language.split('-')[0]; // Supports both options 'en' and 'en-US'
  const translation = i18n.getCatalog(clientLanguage)[moduleName][messageKey];

  if (!translation) {
    throw new Error(
      `Translation by messageKey: ${messageKey} for the module: ${moduleName} has not been found! Please, add it.`
    );
  }

  return translation;
};

export default new Feature({
  middleware: app => {
    app.use(initMiddleware);
  }
});

export { translator };
