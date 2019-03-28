import nodemailer from 'nodemailer';

import settings from '@gqlapp/settings-common';

export default nodemailer.createTransport(settings.mailer);
