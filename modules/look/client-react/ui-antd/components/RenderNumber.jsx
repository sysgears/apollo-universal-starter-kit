import React from 'react';
import PropTypes from 'prop-types';
import DomainSchema from '@domain-schema/core';
import { InputNumber } from 'antd';

import { FormItem } from './index';

export default class RenderNumber extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    formItemLayout: PropTypes.object,
    hasTypeOf: PropTypes.func,
    meta: PropTypes.object
  };

  handleChange = value => {
    const {
      input: { name },
      setFieldValue,
      hasTypeOf
    } = this.props;

    setFieldValue(name, hasTypeOf && hasTypeOf(DomainSchema.Int) ? parseInt(value) || '' : value);
  };

  render() {
    const {
      input: { onChange, ...inputRest },
      label,
      formItemLayout,
      hasTypeOf,
      meta: { touched, error }
    } = this.props;

    const input = {
      onChange: this.handleChange,
      ...inputRest
    };

    if (hasTypeOf && hasTypeOf(DomainSchema.Int)) {
      input.step = '1';
    } else if (hasTypeOf && hasTypeOf(DomainSchema.Float)) {
      input.step = '0.1';
    }

    return (
      <FormItem
        label={label}
        {...formItemLayout}
        validateStatus={touched && error ? 'error' : ''}
        help={touched && error}
      >
        <div>
          <InputNumber {...input} placeholder={label} />
        </div>
      </FormItem>
    );
  }
}
