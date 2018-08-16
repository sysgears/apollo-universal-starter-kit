// TODO: convert to TypeScript when types will be released: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/28017
import cookiesMiddleware from 'universal-cookie-express';

import Feature from '../connector';

export default new Feature({
  beforeware: app => {
    app.use(cookiesMiddleware());
  }
});
