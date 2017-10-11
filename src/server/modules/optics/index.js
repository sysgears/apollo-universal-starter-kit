// Components
import OpticsAgent from 'optics-agent';
import Feature from '../connector';
//import schema from '../../api/schema';

//console.log(schema);
//OpticsAgent.instrumentSchema(schema);

export default new Feature({
  //createContextFunc: req => ({ opticsContext: OpticsAgent.context(req) }),
  middleware: app => {
    app.use('/graphql', OpticsAgent.middleware());
  }
});
