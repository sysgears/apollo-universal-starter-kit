import { setup, cleanup } from '@gqlapp/testing-server-ts';

import '..';

require('@babel/register')({
  cwd: __dirname + '/../../../..',
  extensions: ['.js', '.ts'],
  ignore: [/[\/\\]core-js/, /@babel[\/\\]runtime/, /build\/main.js/]
});

before(setup);
after(cleanup);
