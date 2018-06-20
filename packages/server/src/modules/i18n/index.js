import i18n from 'i18next';
import * as i18nMiddleware from 'i18next-express-middleware';

import Feature from '../connector';
import settings from '../../../../../settings';
import modules from '../../modules';

const addResourcesI18n = () => {
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

const initI18n = () => {
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
  addResourcesI18n();
};

export default new Feature({
  beforeware: app => {
    initI18n();
    app.use(i18nMiddleware.handle(i18n));
  }
});
