import i18n from 'i18n';

import Feature from '../connector';
import settings from '../../../../../settings';

const initMiddleware = async (req, res, next) => {
  i18n.configure(settings.serverI18n);
  i18n.init();
  next();
};

export default new Feature({
  middleware: app => {
    app.use(initMiddleware);
  }
});
