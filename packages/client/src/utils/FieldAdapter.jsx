import React, { Component } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';

export default class FieldAdapter extends Component {
  static contextTypes = {
    formik: PropTypes.object
  };

  static propTypes = {
    component: PropTypes.func,
    onChangeText: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
    if (!context.formik) {
      throw new Error('Field must be inside a component decorated with formik()');
    }
  }

  setFieldValue = () => {
    this.context.formik.setFieldValue(this.props.name, 'dasdasdsa');
  };

  setFieldTouched = () => {
    this.context.formik.setFieldValue(this.props.name, true);
  };

  onChange = e => {
    if (this.props.onChange) {
      this.props.onChange(e);
    } else {
      this.context.formik.handleChange(e);
    }
  };

  onBlur = e => {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    } else {
      if (Platform.OS === 'web') {
        this.context.formik.handleBlur(e);
      } else {
        this.context.formik.setFieldTouched(this.props.name, true);
      }
    }
  };

  onChangeText = value => this.context.formik.setFieldValue(this.props.name, value);

  render() {
    const { formik } = this.context;
    const { component, name, defaultValue, defaultChecked, disabled } = this.props;
    let { value, checked } = this.props;
    value = value || '';
    checked = checked || false;
    const meta = {
      touched: formik.touched[name],
      error: formik.errors[name]
    };

    const input = {
      onBlur: this.onBlur,
      name,
      value,
      checked,
      defaultValue,
      defaultChecked,
      disabled
    };

    const changeEventHandler = Platform.OS === 'web' ? 'onChange' : 'onChangeText';
    input[changeEventHandler] = this[changeEventHandler];

    return React.createElement(component, {
      ...this.props,
      input,
      meta
    });
  }
}
