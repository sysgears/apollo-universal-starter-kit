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
    const {
      input: { name },
      setFieldValue
    } = this.props;
    setFieldValue(name, value);
  };

  render() {
    const {
      input: { value },
      label,
      formItemLayout,
      meta: { touched, error }
    } = this.props;

    return (
      <FormItem
        label={label}
        {...formItemLayout}
        validateStatus={touched && error ? 'error' : ''}
        help={touched && error}
      >
        <div>
          <Switch defaultChecked={!!value} onChange={this.handleChange} />
        </div>
      </FormItem>
    );
  }
}
