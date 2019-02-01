import ClientModule from '@gqlapp/module-client-react';
import createServerApp from './createServerApp';

export default new ClientModule({ createServerApp: [createServerApp] });
