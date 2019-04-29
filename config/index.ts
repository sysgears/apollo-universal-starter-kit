import { pickBy, get } from 'lodash';
import * as modules from './modules';

const envSettings = { ...pickBy(modules, (v, k) => k !== 'env'), ...get(modules, 'env.' + process.env.NODE_ENV) };

export default envSettings;
