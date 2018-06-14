import React from 'react';
import PropTypes from 'prop-types';
import DomainSchema from '@domain-schema/core';

import { FormItem, InputNumber } from './index';

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

  handleChange = e => {
    const {
      input: { name },
      setFieldValue
    } = this.props;

    setFieldValue(name, e.target.value);
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
      //console.log('RenderNumber: hasTypeOf(Float) TRUE');
      input = {
        //step: '0.01',
        ...inputRest
      };
    } else if (hasTypeOf(Number)) {
      //console.log('RenderNumber: hasTypeOf(Number) TRUE');
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
