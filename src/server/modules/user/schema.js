export class Schema {
  static Integer = 'Types.Integer';
}

class AuthCertificate {
  serial = String;
}

class AuthFacebook {
  fbId = String;
  displayName = String;
}

class UserProfile {
  firstName = String;
  lastName = String;
  fullName = String;
}

export class User {
  username = String;
  role = String;
  isActive = {
    type: Boolean,
    optional: true
  };
  email = String;
  certificate = AuthCertificate;
  facebook = AuthFacebook;
  profile = UserProfile;
}
