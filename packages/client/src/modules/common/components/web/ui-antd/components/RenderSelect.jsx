import React from 'react';
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';
import { FormItem } from './index';

const Option = Select.Option;

export default class RenderSelect extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    input: PropTypes.object,
    label: PropTypes.string,
    formItemLayout: PropTypes.object,
    meta: PropTypes.object
  };

  handleChange = value => {
    const { input: { onChange, name } } = this.props;
    //console.log('RenderSelect: handleChange');
    //console.log('name:', name);
    //console.log('value:', value);
    onChange(name, value);
  };

  render() {
    const { input: { value, ...inputRest }, label, data, formItemLayout, meta: { touched, error } } = this.props;

    let validateStatus = '';
    if (touched && error) {
      validateStatus = 'error';
    }

    const options = data
      ? data.map(opt => (
          <Option key={opt.id} value={opt.id.toString()}>
            {opt.name}
          </Option>
        ))
      : null;

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={error}>
        <div>
          <Select
            showSearch
            {...inputRest}
            onChange={this.handleChange}
            defaultValue={value ? String(value) : ''}
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {options}
          </Select>
        </div>
      </FormItem>
    );
  }
}
