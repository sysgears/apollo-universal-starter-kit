import { Express } from 'express';
import ServerModule from '@module/module-server';
import i18n from 'i18next';
import i18nMiddleware from 'i18next-express-middleware';

import settings from '../../../settings';
import commonI18n, { addResourcesI18n } from '@module/i18n';

const beforeware = (app: Express) => {
  if (settings.i18n.enabled) {
    addResourcesI18n(i18n, commonI18n.modules.localizations);

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

export default new ServerModule(commonI18n, {
  beforeware: [beforeware]
});
