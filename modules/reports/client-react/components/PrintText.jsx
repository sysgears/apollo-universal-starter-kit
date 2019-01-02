import React from 'react';
// import PropTypes from 'prop-types';
import ExportPDF from '../containers/withExportPDF';

class PrintText extends React.PureComponent {
  // static propTypes = {};

  render() {
    return (
      <ExportPDF visibly={false}>
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
