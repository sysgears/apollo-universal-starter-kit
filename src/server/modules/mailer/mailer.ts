import * as nodemailer from 'nodemailer';
import settings from '../../../../settings';

export default nodemailer.createTransport(settings.mailer);
