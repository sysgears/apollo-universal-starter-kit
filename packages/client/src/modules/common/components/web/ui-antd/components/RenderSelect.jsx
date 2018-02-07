import React from 'react';
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';
import { FormItem } from './index';

const Option = Select.Option;

const RenderField = ({ input: { value, ...inputRest }, label, data, formItemLayout, meta: { touched, error } }) => {
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
          defaultValue={value.name}
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {options}
        </Select>
      </div>
    </FormItem>
  );
};

RenderField.propTypes = {
  data: PropTypes.array,
  input: PropTypes.object,
  label: PropTypes.string,
  formItemLayout: PropTypes.object,
  meta: PropTypes.object
};

export default RenderField;
