import React from 'react';
import PropTypes from 'prop-types';
import { FormItem, Switch } from './index';

export default class RenderSwitch extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    label: PropTypes.string,
    type: PropTypes.string,
    formItemLayout: PropTypes.object,
    meta: PropTypes.object
  };

  handleChange = value => {
    const { input: { onChange, name } } = this.props;
    //console.log('RenderSwitch: handleChange');
    //console.log('name:', name);
    //console.log('value:', value);
    onChange(name, value);
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
          <Switch defaultChecked={!!value} onChange={this.handleChange} />
        </div>
      </FormItem>
    );
  }
}
