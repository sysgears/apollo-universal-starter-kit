import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

export default class RenderSelectFilterBoolean extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    style: PropTypes.object,
    formItemLayout: PropTypes.object,
    meta: PropTypes.object,
    children: PropTypes.node
  };

  handleChange = value => {
    const {
      input: { name },
      setFieldValue
    } = this.props;
    setFieldValue(name, value);
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
      input: { value, onChange, onBlur, ...inputRest },
      label,
      style,
      formItemLayout,
      meta: { touched, error }
    } = this.props;

    let validateStatus = '';
    if (touched && error) {
      validateStatus = 'error';
    }

    let defaultStyle = { width: '100%' };
    if (style) {
      defaultStyle = style;
    }

    let props = {
      style: defaultStyle,
      name: inputRest.name,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      value: value
    };

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={error}>
        <div>
          <Select {...props}>
            <Option value="">All</Option>
            <Option value="true">Yes</Option>
            <Option value="false">No</Option>
          </Select>
        </div>
      </FormItem>
    );
  }
}
