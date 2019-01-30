import React, { Component, Fragment } from 'react';

import WithExportPDF from '../containers/WithExportPDF';

const ContactRow = ({ values }: { values: string[] }) => (
  <tr>
    {values.map((item, key) => (
      <td key={key}>{item}</td>
    ))}
  </tr>
);

const ContactHeader = ({ headerItems }: { headerItems: string[] }) => (
  <Fragment>
    {headerItems.map((item: string, key: number) => (
      <th key={key}>{item.charAt(0).toUpperCase() + item.slice(1)}</th>
    ))}
  </Fragment>
);

const ContactTable = ({ data }: { data: object[] }) => {
  const rows: any[] = [];
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

interface ReportPreviewProps {
  data: object[];
  title: string;
  button: any;
}

export default class ReportPreview extends Component<ReportPreviewProps> {
  public render() {
    const { data, title, button } = this.props;

    return (
      <WithExportPDF button={button}>
        <h1>{title}</h1>
        <ContactTable data={data} />
      </WithExportPDF>
    );
  }
}
