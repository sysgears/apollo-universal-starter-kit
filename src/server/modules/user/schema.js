import DomainSchema, { SchemaTypes } from '../../../common/DomainSchema';

/* eslint import/prefer-default-export: 0 */

class AuthCertificate extends DomainSchema {
  serial = {
    type: String,
    unique: true
  };
}

class AuthFacebook extends DomainSchema {
  fbId = {
    type: String,
    unique: true
  };
  displayName = {
    type: String,
    optional: true
  };
}

class UserProfile extends DomainSchema {
  firstName = {
    type: String,
    optional: true
  };
  lastName = {
    type: String,
    optional: true
  };
  fullName = {
    type: String,
    optional: true,
    transient: true
  };
}

class UserAuth extends DomainSchema {
  __ = { transient: true };
  certificate = {
    type: AuthCertificate,
    optional: true
  };
  facebook = {
    type: AuthFacebook,
    optional: true
  };
}

export class User extends DomainSchema {
  id = SchemaTypes.Integer;
  username = {
    type: String,
    unique: true
  };
  email = {
    type: String,
    unique: true
  };
  password = {
    type: String,
    private: true
  };
  role = {
    type: String,
    default: 'user'
  };
  isActive = {
    type: Boolean,
    default: false,
    optional: true
  };
  auth = {
    type: UserAuth,
    optional: true
  };
  profile = {
    type: UserProfile,
    optional: true
  };
}
