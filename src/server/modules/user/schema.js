import DomainSchema from '../../../common/DomainSchema';

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
  displayName = String;
}

class UserProfile extends DomainSchema {
  firstName = String;
  lastName = String;
  fullName = {
    type: String,
    transient: true
  };
}

class UserAuth extends DomainSchema {
  __ = { transient: true };
  certificate = AuthCertificate;
  facebook = AuthFacebook;
}

export class User extends DomainSchema {
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
    hidden: true
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
  auth = UserAuth;
  profile = UserProfile;
}
