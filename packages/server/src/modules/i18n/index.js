import i18n from 'i18n';

import Feature from '../connector';
import settings from '../../../../../settings';

const config = {
  directory: process.cwd() + '/src/modules/i18n/locales',
  locales: settings.i18n.langList,
  cookies: settings.cookie
};

const initMiddleware = async (req, res, next) => {
  i18n.configure(config);
  i18n.init();
  next();
};

export default new Feature({
  beforeware: app => {
    app.use(initMiddleware);
  }
});
