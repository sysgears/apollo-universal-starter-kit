import React from 'react';
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';
import { FormItem } from './index';

const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

const RenderField = ({ input: { value, ...inputRest }, label, data, meta: { touched, error } }) => {
  let validateStatus = '';
  if (touched && error) {
    validateStatus = 'error';
  }

  const options = data.map(opt => (
    <Option key={opt.id} value={opt.id.toString()}>
      {opt.name}
    </Option>
  ));

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
  meta: PropTypes.object
};

export default RenderField;
