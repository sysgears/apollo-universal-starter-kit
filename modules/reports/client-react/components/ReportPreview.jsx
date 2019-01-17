import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@module/look-client-react';
import WithExportPDF from '../containers/WithExportPDF';

const ContactRow = ({ report }) => (
  <tr>
    {report.map((item, key) => (
      <td key={key}>{item}</td>
    ))}
  </tr>
);

ContactRow.propTypes = {
  report: PropTypes.array
};

const ContactHeader = ({ headerItem }) => (
  <Fragment>
    {headerItem.map((item, key) => (
      <th key={key}>{item.charAt(0).toUpperCase() + item.slice(1)}</th>
    ))}
  </Fragment>
);

ContactHeader.propTypes = {
  headerItem: PropTypes.array
};

const ContactTable = ({ reports }) => {
  let rows = [];
  reports.forEach((report, key) => {
    rows.push(<ContactRow report={Object.values(report)} key={key} />);
  });

  return (
    <table className="table">
      <thead>
        <tr>
          <ContactHeader headerItem={Object.keys(reports[0])} />
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

ContactTable.propTypes = {
  reports: PropTypes.array,
  title: PropTypes.string
};

class ReportPreview extends Component {
  static propTypes = {
    reports: PropTypes.array,
    title: PropTypes.string.isRequired,
    button: PropTypes.element.isRequired,
    onDownloadPdf: PropTypes.func.isRequired,
    onDownloadExcel: PropTypes.func.isRequired
  };

  render() {
    const { reports, title, button, onDownloadPdf, onDownloadExcel } = this.props;

    return (
      <Fragment>
        <WithExportPDF button={button}>
          <h1>{title}</h1>
          <ContactTable reports={reports} />
        </WithExportPDF>
        <Button onClick={onDownloadPdf}>Donwload PDF</Button>
        <Button onClick={onDownloadExcel}>Donwload Excel</Button>
      </Fragment>
    );
  }
}

export default ReportPreview;
