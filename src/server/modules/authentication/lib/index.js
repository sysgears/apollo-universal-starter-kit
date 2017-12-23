import * as UserBase from './knex/userBase';
import * as UserPassword from './knex/userPassword';
import * as UserPasswordless from './knex/userPasswordless';
import * as UserOAuth from './knex/userOAuth';
import * as UserApikey from './knex/userApikey';
import * as UserCert from './knex/userCert';

import * as SvcAcctApikey from './knex/saApikey';
import * as SvcAcctCert from './knex/saCert';

const Authn = {
  ...UserBase,
  ...UserPassword,
  ...UserPasswordless,
  ...UserOAuth,
  ...UserApikey,
  ...UserCert,

  ...SvcAcctApikey,
  ...SvcAcctCert
};

export default Authn;
