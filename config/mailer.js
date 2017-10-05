import config from './secrets';

export default {
  service: config.mailer.emailService,
  auth: {
    user: config.mailer.emailUser,
    pass: config.mailer.emailPassword
  }
};
