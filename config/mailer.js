import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } from './secrets';

export default {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
};
