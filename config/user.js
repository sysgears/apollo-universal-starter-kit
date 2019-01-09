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
    }
  }
};
