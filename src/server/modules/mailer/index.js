import transporter from './transporter';
import Feature from '../connector';

export default new Feature({
  createContextFunc: () => ({ transporter })
});
