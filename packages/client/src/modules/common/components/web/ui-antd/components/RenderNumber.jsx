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
    hasTypeOf: PropTypes.func.isRequired,
    meta: PropTypes.object
  };

  handleChange = value => {
    const {
      input: { name },
      setFieldValue,
      hasTypeOf
    } = this.props;

    let computedValue = value;
    if (hasTypeOf(Number)) {
      computedValue = value !== '' ? parseFloat(value) : '';
    }
    setFieldValue(name, computedValue);
  };

  handleBlur = () => {
    const {
      input: { name },
      setFieldTouched
    } = this.props;
    setFieldTouched(name, true);
  };

  render() {
    const {
      input: { onChange, onBlur, ...inputRest },
      label,
      formItemLayout,
      hasTypeOf,
      meta: { touched, error }
    } = this.props;

    let validateStatus = '';
    if (touched && error) {
      validateStatus = 'error';
    }

    let input = {
      ...inputRest
    };

    if (hasTypeOf(DomainSchema.Float)) {
      input = {
        step: '0.1',
        ...inputRest
      };
    }

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={touched && error}>
        <div>
          <InputNumber {...input} placeholder={label} onChange={this.handleChange} onBlur={this.handleBlur} />
        </div>
      </FormItem>
    );
  }
}
