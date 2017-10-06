import { AUTH_SECRET } from './secrets';

export default {
  secret: AUTH_SECRET,
  confirm: true,
  sendConfirmationEmail: true,
  auth: {
    password: true,
    certificate: false
  }
};
