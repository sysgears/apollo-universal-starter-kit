import mailer from './mailer';
import Feature from '../connector';

export default new Feature({
  createContextFunc: () => ({ mailer })
});
