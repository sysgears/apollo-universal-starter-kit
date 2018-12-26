import { pickBy, get } from 'lodash';
import * as modules from './config';

const envSettings = Object.assign(
  {},
  pickBy(modules, (v, k) => k !== 'env'),
  get(modules, 'env.' + process.env.NODE_ENV)
);

export default envSettings;
