import nodemailer from 'nodemailer';

import { settings } from '@gqlapp/core-common';

export default nodemailer.createTransport(settings.mailer);
