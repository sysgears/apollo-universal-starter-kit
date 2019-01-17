import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import WithExportPDF from '../containers/WithExportPDF';

const ContactRow = ({ values }) => (
  <tr>
    {values.map((item, key) => (
      <td key={key}>{item}</td>
    ))}
  </tr>
);

ContactRow.propTypes = {
  values: PropTypes.array
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

const ContactTable = ({ report }) => {
  let rows = [];
  report.forEach((row, key) => {
    rows.push(<ContactRow values={Object.values(row)} key={key} />);
  });

  return (
    <table className="table">
      <thead>
        <tr>
          <ContactHeader headerItem={Object.keys(report[0])} />
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

ContactTable.propTypes = {
  report: PropTypes.array,
  title: PropTypes.string
};

class ReportPreview extends Component {
  static propTypes = {
    report: PropTypes.array,
    title: PropTypes.string.isRequired,
    button: PropTypes.element.isRequired
  };

  render() {
    const { report, title, button } = this.props;

    return (
      <Fragment>
        <WithExportPDF button={button}>
          <h1>{title}</h1>
          <ContactTable report={report} />
        </WithExportPDF>
      </Fragment>
    );
  }
}

export default ReportPreview;
