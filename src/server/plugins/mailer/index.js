import mailer from './mailer';
import Plugin from '../plugin';

export default new Plugin({
  createContextFunc: () => ({ mailer })
});
