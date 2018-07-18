import cookiesMiddleware from 'universal-cookie-express';

import Feature from '../connector';

export default new Feature({
  beforeware: app => {
    app.use(cookiesMiddleware());
  }
});
