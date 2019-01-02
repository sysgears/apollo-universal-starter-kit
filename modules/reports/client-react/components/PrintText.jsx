import React from 'react';
import { Button } from '@module/look-client-react';

import ExportPDF from '../containers/withExportPDF';

const button = <Button>Print this out!</Button>;

class PrintText extends React.PureComponent {
  render() {
    return (
      <ExportPDF button={button} visibly={false} positionButton="center">
        <div>Make</div>
        <div>Report</div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </ExportPDF>
    );
  }
}

export default PrintText;
