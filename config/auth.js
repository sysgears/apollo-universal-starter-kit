const CERTIFICATE_DEVSERIAL = '00';

export default {
  secret: process.env.NODE_ENV === 'test' ? 'secret for tests' : process.env.AUTH_SECRET,
  serial: {
    enabled: false
  },
  session: {
    enabled: true
  },
  jwt: {
    enabled: true,
    tokenExpiresIn: '1m',
    refreshTokenExpiresIn: '7d'
  },
  password: {
    requireEmailConfirmation: true,
    sendPasswordChangesEmail: true,
    minLength: 8,
    enabled: true
  },
  certificate: {
    devSerial: CERTIFICATE_DEVSERIAL,
    enabled: false
  },
  social: {
    facebook: {
      enabled: false,
      clientID: process.env.FACEBOOK_CLIENTID,
      clientSecret: process.env.FACEBOOK_CLIENTSECRET,
      callbackURL: '/auth/facebook/callback',
      scope: ['email'],
      profileFields: ['id', 'emails', 'displayName']
    },
    github: {
      enabled: false,
      clientID: process.env.GITHUB_CLIENTID,
      clientSecret: process.env.GITHUB_CLIENTSECRET,
      callbackURL: '/auth/github/callback',
      scope: ['user:email']
    },
    linkedin: {
      enabled: false,
      clientID: process.env.LINKEDIN_CLIENTID,
      clientSecret: process.env.LINKEDIN_CLIENTSECRET,
      callbackURL: '/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_basicprofile']
    },
    google: {
      // The mobile app has two methods to make an authorization:
      // - "redirect" - realized via the passport library,
      // - "apiCall" - realized via the Expo Server side APIs
      // For switch authorization method need to change "mobileTypeAuth"
      // by default "redirect"
      // The web app using only the "redirect" method
      enabled: false,
      mobileTypeAuth: 'redirect',
      redirect: {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENTSECRET,
        callbackURL: '/auth/google/callback',
        scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
      },
      apiCall: {
        androidClientId: process.env.ANDROID_CLIENTID,
        iosClientId: process.env.IOS_CLIENTID
      }
    }
  }
};
