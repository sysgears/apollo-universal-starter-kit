const CERTIFICATE_DEVSERIAL = '00';
export default {
  auth: {
    password: {
      confirm: true,
      sendConfirmationEmail: true,
      sendAddNewUserEmail: true,
      minLength: 8,
      enabled: true
    },
    certificate: {
      devSerial: CERTIFICATE_DEVSERIAL,
      enabled: false
    },
    facebook: {
      enabled: true,
      clientID: '268425530501414',
      clientSecret: '05362e4f3ed03495318008ebb3bde39a',
      callbackURL: '/auth/facebook/callback',
      scope: ['email'],
      profileFields: ['id', 'emails', 'displayName']
    },
    github: {
      enabled: true,
      clientID: '62a26cd6ed51233d7072',
      clientSecret: '7f7374215bb85f37d705c316affa9a2d90ee0407',
      callbackURL: '/auth/github/callback',
      scope: ['user:email']
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
