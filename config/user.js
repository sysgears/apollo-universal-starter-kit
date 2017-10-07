import { AUTH_SECRET, CERTIFICATE_DEVSERIAL, FACEBOOK_CLIENTID, FACEBOOK_CLIENTSECRET } from './secrets';

export default {
  secret: AUTH_SECRET,
  auth: {
    password: {
      confirm: false,
      sendConfirmationEmail: false,
      enabled: true
    },
    certificate: {
      devSerial: CERTIFICATE_DEVSERIAL,
      enabled: false
    },
    facebook: {
      clientID: FACEBOOK_CLIENTID,
      clientSecret: FACEBOOK_CLIENTSECRET,
      enabled: false
    }
  }
};
