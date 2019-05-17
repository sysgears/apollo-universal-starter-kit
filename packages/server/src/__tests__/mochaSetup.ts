import path from 'path';
import { setup, cleanup } from '@gqlapp/testing-server-ts';

import '..';

const root = path.resolve(__dirname + '/../../../..');

require('@babel/register')({
  root,
  cwd: root,
  configFile: root + '/packages/server/babel.config.js',
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  ignore: [/.*node_modules.*/, /build\/main.js/]
});

before(setup);
after(cleanup);
