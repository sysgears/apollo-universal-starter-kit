import { app as settings } from './app.json';
import _ from 'lodash';

const envSettings = Object.assign(
  {},
  _.pickBy(settings, (v, k) => k !== 'env'),
  _.get(settings, "env." + process.env.NODE_ENV)
);

export default envSettings;