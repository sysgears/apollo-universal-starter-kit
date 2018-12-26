import PropTypes from 'prop-types';
import React from 'react';
import Color from './Color';

export default class Actions extends React.Component {
  constructor(props) {
    super(props);
    this.onActionsPress = this.onActionsPress.bind(this);
  }

  onActionsPress() {
    const options = Object.keys(this.props.options);
    const cancelButtonIndex = Object.keys(this.props.options).length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        tintColor: this.props.optionTintColor
      },
      buttonIndex => {
        let i = 0;
        Object.keys(this.props.options).forEach(key => {
          if (this.props.options[key]) {
            if (buttonIndex === i) {
              this.props.options[key](this.props);
              return;
            }
            i += 1;
          }
        });
      }
    );
  }

  renderIcon() {
    if (this.props.icon) {
      return this.props.icon();
    }
    return (
      <div style={[styles.wrapper, this.props.wrapperStyle]}>
        <span style={[styles.iconText, this.props.iconTextStyle]}>+</span>
      </div>
    );
  }

  render() {
    return (
      <div
        style={[styles.container, this.props.containerStyle]}
        onPress={this.props.onPressActionButton || this.onActionsPress}
      >
        {this.renderIcon()}
      </div>
    );
  }
}

const styles = {
  container: {
    width: '26px',
    height: '26px',
    marginLeft: '10px',
    marginBottom: '10px'
  },
  wrapper: {
    borderRadius: '13px',
    borderColor: Color.defaultColor,
    borderWidth: '2px',
    flex: 1
  },
  iconText: {
    color: Color.defaultColor,
    fontWeight: 'bold',
    fontSize: '16px',
    backgroundColor: Color.backgroundTransparent,
    textAlign: 'center'
  }
};

Actions.contextTypes = {
  actionSheet: PropTypes.func
};

Actions.defaultProps = {
  onSend: () => {},
  options: {},
  optionTintColor: Color.optionTintColor,
  icon: null,
  containerStyle: {},
  iconTextStyle: {},
  wrapperStyle: {}
};

Actions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  optionTintColor: PropTypes.string,
  icon: PropTypes.func,
  onPressActionButton: PropTypes.func,
  wrapperStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  iconTextStyle: PropTypes.object
};
