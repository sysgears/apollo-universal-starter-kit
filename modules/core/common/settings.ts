import { pickBy, get } from 'lodash';
import * as modules from '../../../config';

const envSettings = { ...pickBy(modules, (_, k) => k !== 'env'), ...get(modules, 'env.' + process.env.NODE_ENV) };

export default envSettings;
