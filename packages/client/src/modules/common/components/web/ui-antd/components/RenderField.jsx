import React from 'react';
import PropTypes from 'prop-types';
import DomainSchema from '@domain-schema/core';

import { FormItem, Input } from './index';

export default class RenderField extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    label: PropTypes.string,
    type: PropTypes.string,
    formItemLayout: PropTypes.object,
    hasTypeOf: PropTypes.func.isRequired,
    meta: PropTypes.object
  };

  handleChange = e => {
    const { input: { onChange, name }, hasTypeOf } = this.props;
    //console.log('RenderField: handleChange');
    //console.log('name:', name);
    let value = e.target.value;
    //console.log('value:', value);
    if (hasTypeOf(Number)) {
      value = value !== '' ? parseFloat(value) : '';
      //console.log('RenderField: hasTypeOf(Number) TRUE');
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
      //console.log('RenderField: hasTypeOf(Float) TRUE');
      input = {
        step: '0.01',
        ...inputRest
      };
    } else if (hasTypeOf(Number)) {
      //console.log('RenderField: hasTypeOf(Number) TRUE');
    }

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={touched && error}>
        <div>
          <Input {...input} placeholder={label} type={type} onChange={this.handleChange} />
        </div>
      </FormItem>
    );
  }
}
