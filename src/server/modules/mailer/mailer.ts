import * as nodemailer from 'nodemailer';
import { settings } from '../../../../settings';

export const mailer = nodemailer.createTransport(settings.mailer);
