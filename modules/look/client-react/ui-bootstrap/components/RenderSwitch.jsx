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

  handleChange = e => {
    const {
      input: { name },
      setFieldValue
    } = this.props;
    setFieldValue(name, e.target.checked);
  };

  render() {
    const {
      input: { value },
      label,
      formItemLayout,
      meta: { touched, error }
    } = this.props;

    let validateStatus = '';
    if (touched && error) {
      validateStatus = 'error';
    }

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={touched && error}>
        <div>
          <Switch checked={!!value} onChange={this.handleChange} />
        </div>
      </FormItem>
    );
  }
}
