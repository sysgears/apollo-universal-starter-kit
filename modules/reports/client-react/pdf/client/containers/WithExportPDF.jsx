import React, { Fragment, Component } from 'react';
import ReactToPrint from 'react-to-print';

import PropTypes from 'prop-types';

export default class ExportPDF extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    button: PropTypes.element.isRequired
  };

  render() {
    const { children, button } = this.props;

    return (
      <Fragment>
        <div ref={el => (this.ref = el)}>{children}</div>
        <ReactToPrint trigger={() => button} content={() => this.ref} />
      </Fragment>
    );
  }
}
