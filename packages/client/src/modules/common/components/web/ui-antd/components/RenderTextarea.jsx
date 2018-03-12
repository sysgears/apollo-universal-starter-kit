import React from 'react';
import PropTypes from 'prop-types';
import Input from 'antd/lib/input';

import { FormItem } from './index';

const { TextArea } = Input;

export default class RenderTextarea extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    label: PropTypes.string,
    type: PropTypes.string,
    formItemLayout: PropTypes.object,
    hasTypeOf: PropTypes.func.isRequired,
    meta: PropTypes.object
  };

  handleChange = e => {
    const { input: { onChange, name } } = this.props;
    //console.log('RenderInput: handleChange');
    //console.log('name:', name);
    let value = e.target.value;
    //console.log('value:', value);

    onChange(name, value);
  };

  render() {
    const { input: { onChange, ...inputRest }, label, formItemLayout, meta: { touched, error } } = this.props;

    let validateStatus = '';
    if (touched && error) {
      validateStatus = 'error';
    }

    let input = {
      ...inputRest
    };

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={touched && error}>
        <div>
          <TextArea {...input} placeholder={label} autosize onChange={this.handleChange} />
        </div>
      </FormItem>
    );
  }
}
