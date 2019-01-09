export default {
  secret: process.env.NODE_ENV === 'test' ? 'secret for tests' : process.env.AUTH_SECRET,
  session: {
    enabled: true
  },
  jwt: {
    enabled: true,
    tokenExpiresIn: '1m',
    refreshTokenExpiresIn: '7d'
  },
  social: {
    github: {
      enabled: true,
      clientID: '62a26cd6ed51233d7072',
      clientSecret: '7f7374215bb85f37d705c316affa9a2d90ee0407',
      callbackURL: '/auth/github/callback',
      scope: ['user:email']
    },
    facebook: {
      enabled: false,
      clientID: process.env.FACEBOOK_CLIENTID,
      clientSecret: process.env.FACEBOOK_CLIENTSECRET,
      callbackURL: '/auth/facebook/callback',
      scope: ['email'],
      profileFields: ['id', 'emails', 'displayName']
    },
    linkedin: {
      enabled: true,
      clientID: '77vwua4llmj10t',
      clientSecret: 'bG5cPSzvOmqNLNbH',
      callbackURL: '/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_basicprofile']
    },
    google: {
      enabled: true,
      clientID: '936744536604-phfojlvtniin07oukj07b33qju8edjdn.apps.googleusercontent.com',
      clientSecret: 'rq_IhawCIRqWezn4Y_QDah0Z',
      callbackURL: '/auth/google/callback',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
    }
  }
};
