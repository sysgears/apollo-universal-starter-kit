const CERTIFICATE_DEVSERIAL = '00';

export default {
  secret: process.env.AUTH_SECRET,
  password: {
    enabled: true,
    confirm: true,
    sendConfirmationEmail: true,
    sendAddNewUserEmail: true
  },
  passwordless: {
    enabled: false,
    confirm: true,
    sendConfirmationEmail: true,
    sendAddNewUserEmail: true
  },
  certificate: {
    enabled: true,
    devSerial: CERTIFICATE_DEVSERIAL
  },
  oauth: {
    enabled: true,
    providers: {
      facebook: {
        clientID: process.env.FACEBOOK_CLIENTID,
        clientSecret: process.env.FACEBOOK_CLIENTSECRET
      },
      google: {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENTSECRET
      }
    }
  }
};
