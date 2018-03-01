import React, { Component } from 'react';
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

  render() {
    const { formik } = this.context;
    const { component, name, defaultValue, defaultChecked, onChange, disabled, onBlur, onChangeText } = this.props;
    let { value, checked } = this.props;
    value = value || '';
    checked = checked || false;
    const meta = {
      touched: formik.touched[name],
      error: formik.errors[name]
    };

    const input = {
      onChange: onChange ? onChange : onChangeText ? onChangeText : formik.handleChange,
      onBlur: onBlur ? onBlur : formik.handleBlur,
      name,
      value,
      checked,
      defaultValue,
      defaultChecked,
      disabled
    };

    return React.createElement(component, {
      ...this.props,
      input,
      meta
    });
  }
}
