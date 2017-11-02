import Feature from '../connector';
import mailer from './mailer';

export default new Feature({
  createContextFunc: () => ({ mailer })
});
