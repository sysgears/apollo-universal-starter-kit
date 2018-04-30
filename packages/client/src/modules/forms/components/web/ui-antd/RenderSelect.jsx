import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';

const FormItem = Form.Item;
const Option = Select.Option;

const RenderSelect = ({ input, options, meta: { touched, error } }) => {
  let validateStatus = '';
  if (touched && error) {
    validateStatus = 'error';
  }
  const { label, values } = input;

  return (
    <FormItem label={label} validateStatus={validateStatus} help={touched && error} {...options}>
      <div>
        <Select {...input} defaultValue={input.value}>
          {values.map(option => {
            return option.value ? (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ) : (
              <Option key={option} value={option}>
                {option}
              </Option>
            );
          })}
        </Select>
      </div>
    </FormItem>
  );
};

RenderSelect.propTypes = {
  input: PropTypes.object,
  options: PropTypes.object,
  meta: PropTypes.object
};

export default RenderSelect;
