import React from 'react';
// import PropTypes from 'prop-types';
import withExportPDF from '../containers/withExportPDF';

class PrintText extends React.PureComponent {
  // static propTypes = {};

  render() {
    return (
      <div>
        <div>Make</div>
        <div>Report</div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default withExportPDF(PrintText);
