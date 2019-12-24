import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import { get as getPath } from 'lodash';

import { PLATFORM } from '@gqlapp/core-common';

class FieldAdapter extends Component {
  static propTypes = {
    formik: PropTypes.object.isRequired,
    component: PropTypes.func,
    onChangeText: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number, PropTypes.object]),
    defaultValue: PropTypes.string,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  onChange = e => {
    const { formik, onChange } = this.props;

    if (onChange) {
      onChange(e.target.value, e);
    } else {
      formik.handleChange(e);
    }
  };

  onBlur = e => {
    const { formik, onBlur, name } = this.props;
    if (onBlur) {
      onBlur(e);
    } else {
      if (PLATFORM === 'mobile') {
        formik.setFieldTouched(name, true);
      } else {
        formik.handleBlur(e);
      }
    }
  };

  onChangeText = value => {
    const { formik, onChangeText, onChange, name } = this.props;
    if (onChange && !onChangeText) {
      onChange(value);
    } else if (onChangeText) {
      onChangeText(value);
    } else {
      formik.setFieldValue(name, value);
    }
  };

  render() {
    const { formik, component, name, defaultValue, defaultChecked, disabled } = this.props;
    let { value, checked } = this.props;
    value = value || '';
    checked = checked || false;
    const meta = {
      touched: getPath(formik.touched, name),
      error: getPath(formik.errors, name)
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

    const changeEventHandler = PLATFORM === 'mobile' ? 'onChangeText' : 'onChange';
    input[changeEventHandler] = this[changeEventHandler];

    return React.createElement(component, {
      ...this.props,
      input,
      setFieldValue: formik.setFieldValue,
      setFieldTouched: formik.setFieldTouched,
      meta
    });
  }
}

export default connect(FieldAdapter);
