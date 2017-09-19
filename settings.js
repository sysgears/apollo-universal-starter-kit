import _ from 'lodash';
import { app as settings } from './app.json';

const envSettings = Object.assign(
  {},
  _.pickBy(settings, (v, k) => k !== 'env'),
  _.get(settings, 'env.' + process.env.NODE_ENV)
);

export default envSettings;
