import ClientModule from '@gqlapp/module-client-react';
import pdfServer from './pdf/server';
import pdfClient from './pdf/client';
import excel from './excel';

export default new ClientModule(pdfClient, pdfServer, excel);
