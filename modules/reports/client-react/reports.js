import pdfServer from './pdf/server';
import pdfClient from './pdf/client';
import excel from './excel';

import ReportModule from './ReportModule';

export default new ReportModule(pdfClient, pdfServer, excel);
