import { AUTH_SECRET, FACEBOOK_CLIENTID, FACEBOOK_CLIENTSECRET } from './secrets';

export default {
  secret: AUTH_SECRET,
  auth: {
    password: {
      confirm: false,
      sendConfirmationEmail: false,
      enabled: true
    },
    certificate: {
      devSerial: '00',
      enabled: false
    },
    facebook: {
      clientID: FACEBOOK_CLIENTID,
      clientSecret: FACEBOOK_CLIENTSECRET,
      enabled: true
    }
  }
};
