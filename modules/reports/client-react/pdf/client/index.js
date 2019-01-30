import React from 'react';
import ClientModule from '@gqlapp/module-client-react';

import resources from './locales';
import PrintReport from './containers/PrintReport';

export default new ClientModule({
  localization: [{ ns: 'PrintReport', resources }],
  reportComponent: [<PrintReport />]
});
