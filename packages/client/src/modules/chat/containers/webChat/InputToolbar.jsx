import PropTypes from 'prop-types';
import React from 'react';

import Composer from './Composer';
// import Send from './Send';
// import Actions from './Actions';
import Color from './Color';

export default class InputToolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  renderActions() {
    if (this.props.renderActions) {
      return this.props.renderActions(this.props);
    } else if (this.props.onPressActionButton) {
      //return <Actions {...this.props} />;
    }
    return null;
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    //return <Send {...this.props} />;
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }

    return <Composer {...this.props} />;
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return <div style={[styles.accessory, this.props.accessoryStyle]}>{this.props.renderAccessory(this.props)}</div>;
    }
    return null;
  }

  render() {
    return (
      <div style={[styles.container, this.props.containerStyle, { position: this.state.position }]}>
        <div style={[styles.primary, this.props.primaryStyle]}>
          {this.renderActions()}
          {this.renderComposer()}
          {this.renderSend()}
        </div>
        {this.renderAccessory()}
      </div>
    );
  }
}

const styles = {
  container: {
    'border-top-width': '2px',
    'border-top-color': Color.defaultColor,
    'background-color': Color.white,
    bottom: '0px',
    left: '0px',
    right: '0px'
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  accessory: {
    height: '44px'
  }
};

InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
  onPressActionButton: () => {}
};

InputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: PropTypes.object,
  primaryStyle: PropTypes.object,
  accessoryStyle: PropTypes.object
};
