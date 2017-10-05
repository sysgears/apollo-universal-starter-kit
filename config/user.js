import config from './secrets';

export default {
  secret: config.auth.authSecret,
  confirm: false,
  sendConfirmationEmail: false,
  auth: {
    password: true,
    certificate: false
  }
};
