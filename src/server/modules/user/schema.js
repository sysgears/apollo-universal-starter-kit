import DomainSchema, { Schema } from '../../../common/DomainSchema';

/* eslint import/prefer-default-export: 0 */

class AuthCertificate extends Schema {
  serial = {
    type: String,
    unique: true
  };
}

class AuthFacebook extends Schema {
  fbId = {
    type: String,
    unique: true
  };
  displayName = {
    type: String,
    optional: true
  };
}

class UserProfile extends Schema {
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

class UserAuth extends Schema {
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

export const User = new DomainSchema(
  class User extends Schema {
    id = DomainSchema.Integer;
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
);
