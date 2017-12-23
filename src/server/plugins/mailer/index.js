import mailer from './mailer';
import Plugin from '../connector';

export default new Plugin({
  createContextFunc: () => ({ mailer })
});
