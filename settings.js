import _ from 'lodash';
import { app as settings } from './app.json';
import * as modules from './config';

const allSettings = Object.assign(settings, modules);
const envSettings = Object.assign(
  {},
  _.pickBy(allSettings, (v, k) => k !== 'env'),
  _.get(allSettings, 'env.' + process.env.NODE_ENV)
);

export default envSettings;
