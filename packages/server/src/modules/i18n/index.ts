import Feature from '../connector';
import settings from '../../../../../settings';
import modules from '../../modules';

const addResourcesI18n = i18n => {
  for (const localization of modules.localizations) {
    for (const lang of Object.keys(localization.resources)) {
      i18n.addResourceBundle(
        i18n.options.whitelist.filter(lng => lng.indexOf(lang) > -1)[0] || lang,
        localization.ns,
        localization.resources[lang]
      );
    }
  }
};

const initI18n = (i18n, i18nMiddleware) => {
  i18n.use(i18nMiddleware.LanguageDetector).init({
    fallbackLng: settings.i18n.fallbackLng,
    resources: {},
    debug: false, // set true to show logs
    whitelist: settings.i18n.langList,
    preload: settings.i18n.langList,
    detection: {
      lookupCookie: settings.i18n.cookie
    }
  });
  addResourcesI18n(i18n);
};

export default new Feature({
  beforeware: app => {
    const i18n = require('i18next');
    const i18nMiddleware = require('i18next-express-middleware');

    if (settings.i18n.enabled) {
      initI18n(i18n, i18nMiddleware);
      app.use((req, res, next) => {
        const lang = req.universalCookies.get(settings.i18n.cookie) || req.acceptsLanguages(settings.i18n.langList);
        req.universalCookies.set(settings.i18n.cookie, lang);
        next();
      });

      app.use(i18nMiddleware.handle(i18n));
    } else {
      app.use((req, res, next) => {
        req.t = key => key;
        next();
      });
    }
  }
});
