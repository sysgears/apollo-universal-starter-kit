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

  onChange = e => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e.target.value, e);
    } else {
      this.context.formik.handleChange(e);
    }
  };

  onBlur = e => {
    const { onBlur, name } = this.props;
    const { formik } = this.context;
    if (onBlur) {
      onBlur(e);
    } else {
      if (typeof document !== 'undefined') {
        formik.handleBlur(e);
      } else {
        formik.setFieldTouched(name, true);
      }
    }
  };

  onChangeText = value => {
    const { onChangeText, onChange, name } = this.props;
    if (onChange && !onChangeText) {
      onChange(value);
    } else if (onChangeText) {
      onChangeText(value);
    } else {
      this.context.formik.setFieldValue(name, value);
    }
  };

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

    const changeEventHandler = typeof document !== 'undefined' ? 'onChange' : 'onChangeText';
    input[changeEventHandler] = this[changeEventHandler];

    return React.createElement(component, {
      ...this.props,
      input,
      meta
    });
  }
}
