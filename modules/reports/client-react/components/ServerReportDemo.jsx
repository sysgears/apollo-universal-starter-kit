import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

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
  reports: PropTypes.array
};

class ServerReportDemo extends Component {
  static propTypes = {
    reports: PropTypes.array
  };

  render() {
    const { reports } = this.props;
    return (
      <div>
        <h1>React List Demo for Print from Server</h1>
        <ContactTable reports={reports} />
      </div>
    );
  }
}

export default ServerReportDemo;
