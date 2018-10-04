// TODO: convert to TypeScript when types will be released: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/28017
import cookiesMiddleware from 'universal-cookie-express';

import ServerModule from '../ServerModule';

const beforeware = app => {
  app.use(cookiesMiddleware());
};

export default new ServerModule({
  beforeware: [beforeware]
});
