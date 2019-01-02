import React, { Fragment, Component } from 'react';
import ReactToPrint from 'react-to-print';

import PropTypes from 'prop-types';

const noVisibly = { position: 'fixed', right: -1000 };

const left = { display: 'flex', justifyContent: 'flex-start' };
const center = { display: 'flex', justifyContent: 'center' };
const right = { display: 'flex', justifyContent: 'flex-end' };

class ExportPDF extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    button: PropTypes.element.isRequired,
    visibly: PropTypes.bool,
    positionButton: PropTypes.string
  };

  state = {
    visibly: { display: 'block' },
    positionButton: {}
  };

  componentDidMount() {
    const { visibly = true, positionButton = 'left' } = this.props;

    if (!visibly) {
      this.setState({
        visibly: noVisibly
      });
    }

    switch (positionButton) {
      case 'left':
        return this.setState({ positionButton: left });
      case 'center':
        return this.setState({ positionButton: center });
      case 'right':
        return this.setState({ positionButton: right });
    }
  }

  render() {
    const { children, button } = this.props;
    const { visibly, positionButton } = this.state;

    return (
      <Fragment>
        <div style={visibly}>
          <div ref={el => (this.ref = el)}>{children}</div>
        </div>
        <div style={positionButton}>
          <ReactToPrint trigger={() => button} content={() => this.ref} />
        </div>
      </Fragment>
    );
  }
}

export default ExportPDF;
