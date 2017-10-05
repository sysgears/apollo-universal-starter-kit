import * as _ from 'lodash';

import * as appJson from './app.json';

const settings = appJson.app;

interface AppSettings {
  apolloLogging?: boolean;
}

const envSettings: AppSettings = {
  ..._.pickBy(settings, (v, k) => k !== 'env'),
  ..._.get(settings, 'env.' + process.env.NODE_ENV)
};

export default envSettings;
