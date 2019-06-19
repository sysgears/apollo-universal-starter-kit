import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';

import { PLATFORM } from '@gqlapp/core-common';

const FieldAdapter = props => {
  const { formik, onChange, onChangeText, onBlur, name, component, defaultValue, defaultChecked, disabled } = props;
  let { value, checked } = props;

  const handleOnChange = e => {
    if (onChange) {
      onChange(e.target.value, e);
    } else {
      formik.handleChange(e);
    }
  };

  const handleOnBlur = e => {
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

  const handleOnChangeText = value => {
    if (onChange && !onChangeText) {
      onChange(value);
    } else if (onChangeText) {
      onChangeText(value);
    } else {
      formik.setFieldValue(name, value);
    }
  };

  value = value || '';
  checked = checked || false;
  const meta = {
    touched: formik.touched[name],
    error: formik.errors[name]
  };

  const input = {
    onBlur: handleOnBlur,
    name,
    value,
    checked,
    defaultValue,
    defaultChecked,
    disabled
  };

  const changeEventHandler = PLATFORM === 'mobile' ? handleOnChangeText : handleOnChange;
  input[PLATFORM === 'mobile' ? 'onChangeText' : 'onChange'] = changeEventHandler;

  return React.createElement(component, {
    ...props,
    input,
    meta
  });
};

FieldAdapter.propTypes = {
  formik: PropTypes.object.isRequired,
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

export default connect(FieldAdapter);
