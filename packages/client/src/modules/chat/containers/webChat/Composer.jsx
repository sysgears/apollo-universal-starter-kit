import PropTypes from 'prop-types';
import React from 'react';

import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from './Constant';
import Color from './Color';

export default class Composer extends React.Component {
  onChangeText(text) {
    this.props.onTextChanged(text.target.value);
  }

  render() {
    return (
      <input
        placeholder={this.props.placeholder}
        //placeholderTextColor={this.props.placeholderTextColor}
        //multiline={this.props.multiline}
        //onChange={e => this.onContentSizeChange(e)}
        onChange={text => this.onChangeText(text)}
        style={[styles.textInput, this.props.textInputStyle, { height: this.props.composerHeight }]}
        value={this.props.text}
      />
    );
  }
}

const styles = {
  textInput: {
    marginLeft: '10px',
    fontSize: '16px',
    lineHeight: '16px',
    marginTop: '6px',
    marginBottom: '3px'
  }
};

Composer.defaultProps = {
  composerHeight: MIN_COMPOSER_HEIGHT,
  text: '',
  placeholderTextColor: Color.defaultProps,
  placeholder: DEFAULT_PLACEHOLDER,
  textInputProps: null,
  multiline: true,
  textInputStyle: {},
  textInputAutoFocus: false,
  keyboardAppearance: 'default',
  onTextChanged: () => {}
};

Composer.propTypes = {
  composerHeight: PropTypes.number,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  onTextChanged: PropTypes.func,
  onInputSizeChanged: PropTypes.func,
  multiline: PropTypes.bool,
  textInputStyle: PropTypes.object,
  textInputAutoFocus: PropTypes.bool,
  keyboardAppearance: PropTypes.string
};
