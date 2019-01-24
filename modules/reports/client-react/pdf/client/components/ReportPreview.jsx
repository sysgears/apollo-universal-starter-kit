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

const ContactHeader = ({ headerItems }) => (
  <Fragment>
    {headerItems.map((item, key) => (
      <th key={key}>{item.charAt(0).toUpperCase() + item.slice(1)}</th>
    ))}
  </Fragment>
);

ContactHeader.propTypes = {
  headerItems: PropTypes.array
};

const ContactTable = ({ data }) => {
  let rows = [];
  data.forEach((row, key) => {
    rows.push(<ContactRow values={Object.values(row)} key={key} />);
  });

  return (
    <table className="table">
      <thead>
        <tr>
          <ContactHeader headerItems={Object.keys(data[0])} />
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

ContactTable.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string
};

class ReportPreview extends Component {
  static propTypes = {
    data: PropTypes.array,
    title: PropTypes.string.isRequired,
    button: PropTypes.element.isRequired
  };

  render() {
    const { data, title, button } = this.props;

    return (
      <WithExportPDF button={button}>
        <h1>{title}</h1>
        <ContactTable data={data} />
      </WithExportPDF>
    );
  }
}

export default ReportPreview;
