import { app as settings } from '../../../../package.json';

if (__DEV__ && settings.debugSQL) {
  require('./debug');
}
