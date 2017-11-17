const CERTIFICATE_DEVSERIAL = '00';

export default {
  secret: process.env.AUTH_SECRET,
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
      clientID: process.env.FACEBOOK_CLIENTID,
      clientSecret: process.env.FACEBOOK_CLIENTSECRET,
      enabled: true
    }
  }
};
