import React from 'react';

import resources from './locales';
import PrintReport from './containers/PrintReport';
import ReportModule from '../../ReportModule';

export default new ReportModule({
  localization: [{ ns: 'PrintReport', resources }],
  reportComponent: [<PrintReport />]
});
