import React from 'react';
import ClientModule from '@gqlapp/module-client-react';

import resources from './locales';
import DownloadReport from './containers/DownloadReport';

export default new ClientModule({
  localization: [{ ns: 'ExcelReport', resources }],
  reportComponent: [<DownloadReport />]
});
