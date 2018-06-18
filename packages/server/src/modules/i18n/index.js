import i18n from 'i18next';
import * as middleware from 'i18next-express-middleware';

import Feature from '../connector';
import settings from '../../../../../settings';
import modules from '../../../../server/src/modules';

const I18nProvider = () => {
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

const initMiddleware = async (req, res, next) => {
  i18n.use(middleware.LanguageDetector).init({
    fallbackLng: settings.i18n.fallbackLng,
    resources: {},
    debug: false, // set true to show logs
    whitelist: settings.i18n.langList,
    detection: {
      lookupCookie: settings.i18n.cookie
    }
  });
  I18nProvider();
  next();
};

export default new Feature({
  beforeware: app => {
    app.use(initMiddleware);
  }
});
