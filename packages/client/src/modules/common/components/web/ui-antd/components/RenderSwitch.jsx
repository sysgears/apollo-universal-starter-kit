import React from 'react';
import PropTypes from 'prop-types';
import { FormItem, Switch } from './index';

export default class RenderSwitch extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    formItemLayout: PropTypes.object,
    meta: PropTypes.object
  };

  handleChange = value => {
    const { input: { name }, setFieldValue } = this.props;
    //console.log('RenderSwitch: handleChange');
    //console.log('name:', name);
    //console.log('value:', value);
    setFieldValue(name, value);
  };

  handleBlur = () => {
    const { input: { name }, setFieldTouched } = this.props;
    setFieldTouched(name, true);
  };

  render() {
    const { input: { value }, label, formItemLayout, meta: { touched, error } } = this.props;

    let validateStatus = '';
    if (touched && error) {
      validateStatus = 'error';
    }

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={touched && error}>
        <div>
          <Switch defaultChecked={!!value} onChange={this.handleChange} onBlur={this.handleBlur} />
        </div>
      </FormItem>
    );
  }
}
