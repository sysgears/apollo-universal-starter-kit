import mailer from './mailer';
import ServerModule from '../ServerModule';

export default new ServerModule({
  createContextFunc: [() => ({ mailer })]
});
