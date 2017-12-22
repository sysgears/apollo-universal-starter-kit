import { Feature } from '../connector';
import { mailer } from './mailer';

export const mailerModule = new Feature({
  createContextFunc: () => ({ mailer })
});
