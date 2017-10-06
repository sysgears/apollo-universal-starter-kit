import * as _ from 'lodash';

import * as appJson from './app.json';
import * as modules from './config';

const settings = appJson.app;

interface AppSettings {
  apolloLogging?: boolean;
  user?: any;
}

const allSettings = {
  ...settings,
  ...modules
};

const envSettings: AppSettings = {
  ..._.pickBy(allSettings, (v, k) => k !== 'env'),
  ..._.get(allSettings, 'env.' + process.env.NODE_ENV)
};

export default envSettings;
