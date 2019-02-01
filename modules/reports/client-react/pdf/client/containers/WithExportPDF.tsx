import React, { Fragment, Component } from 'react';
import ReactToPrint from 'react-to-print';

interface ExportPDFProps {
  children: any;
  button: any;
}

export default class ExportPDF extends Component<ExportPDFProps> {
  private ref: any;

  public render() {
    const { children, button } = this.props;

    return (
      <Fragment>
        <div ref={el => (this.ref = el)}>{children}</div>
        <ReactToPrint trigger={() => button} content={() => this.ref} />
      </Fragment>
    );
  }
}
