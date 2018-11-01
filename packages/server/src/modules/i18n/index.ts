import { Express } from 'express';

import ServerModule from '../ServerModule';
import settings from '../../../../../settings';
import modules from '../../modules';
import { addResourcesI18n } from '../../../../common/utils';

const beforeware = (app: Express) => {
  const i18n = require('i18next');
  const i18nMiddleware = require('i18next-express-middleware');

  if (settings.i18n.enabled) {
    addResourcesI18n(i18n, modules.localizations);
    app.use((req: any, res, next) => {
      const lang = req.universalCookies.get(settings.i18n.cookie) || req.acceptsLanguages(settings.i18n.langList);
      req.universalCookies.set(settings.i18n.cookie, lang);
      next();
    });

    app.use(i18nMiddleware.handle(i18n));
  } else {
    app.use((req: any, res, next) => {
      req.t = (key: string) => key;
      next();
    });
  }
};

export default new ServerModule({
  beforeware: [beforeware]
});
