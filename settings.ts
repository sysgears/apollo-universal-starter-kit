import 'dotenv/config';
import * as _ from 'lodash';
import * as Settings from './config';

interface AppSettings {
  app?: any;
  apolloLogging?: boolean;
  user?: any;
  db?: any;
  mailer?: any;
  engine?: any;
  analytics?: any;
}

const settings: AppSettings = {
  ..._.pickBy(Settings, (v, k) => k !== 'env'),
  ..._.get(Settings, 'env.' + process.env.NODE_ENV)
};

export { settings };
