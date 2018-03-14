import React from 'react';
import PropTypes from 'prop-types';
import DomainSchema from '@domain-schema/core';
import InputNumber from 'antd/lib/input-number';

import { FormItem } from './index';

export default class RenderNumber extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    label: PropTypes.string,
    type: PropTypes.string,
    formItemLayout: PropTypes.object,
    hasTypeOf: PropTypes.func.isRequired,
    meta: PropTypes.object
  };

  handleChange = value => {
    const { input: { onChange, name }, hasTypeOf } = this.props;
    //console.log('RenderInput: handleChange');
    //console.log('name:', name);
    if (hasTypeOf(Number)) {
      value = value !== '' ? parseFloat(value) : '';
      //console.log('RenderInput: hasTypeOf(Number) TRUE');
    }

    onChange(name, value);
  };

  render() {
    const {
      input: { onChange, ...inputRest },
      label,
      type,
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
      //console.log('RenderNumber: hasTypeOf(Float) TRUE');
      input = {
        step: '0.01',
        ...inputRest
      };
    } else if (hasTypeOf(Number)) {
      //console.log('RenderNumber: hasTypeOf(Number) TRUE');
    }

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={touched && error}>
        <div>
          <InputNumber {...input} placeholder={label} type={type} onChange={this.handleChange} />
        </div>
      </FormItem>
    );
  }
}
