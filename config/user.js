const CERTIFICATE_DEVSERIAL = '00';
const LOCAL_URL = 'exp://192.168.0.155:19500/+';
const PRODUCTION_URL = 'com.sysgears.apollokit://';
export default {
  secret: process.env.AUTH_SECRET,
  MOBILE_APP_URL: process.env.NODE_ENV === 'production' ? PRODUCTION_URL : LOCAL_URL,
  auth: {
    password: {
      confirm: true,
      sendConfirmationEmail: true,
      sendAddNewUserEmail: true,
      enabled: true
    },
    certificate: {
      devSerial: CERTIFICATE_DEVSERIAL,
      enabled: false
    },
    facebook: {
      enabled: true,
      clientID: process.env.FACEBOOK_CLIENTID,
      clientSecret: process.env.FACEBOOK_CLIENTSECRET,
      scope: ['email'],
      profileFields: ['id', 'emails', 'displayName']
    },
    google: {
      enabled: true,
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
    }
  }
};
