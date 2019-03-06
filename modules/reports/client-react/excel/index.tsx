import React from 'react';

import resources from './locales';
import DownloadReport from './containers/DownloadReport';
import ReportModule from '../ReportModule';

export default new ReportModule({
  localization: [{ ns: 'ExcelReport', resources }],
  reportComponent: [<DownloadReport />]
});
