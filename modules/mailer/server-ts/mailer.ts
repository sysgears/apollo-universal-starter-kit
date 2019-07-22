import nodemailer from 'nodemailer';

import settings from '@gqlapp/config';

export default nodemailer.createTransport(settings.mailer);
