import React from 'react';
import PropTypes from 'prop-types';
import { Picker, List } from 'antd-mobile/lib';

const Select = ({ placeholder, onValueChange, onChange, selectedValue, value, ...props }) => {
  return (
    <Picker
      onChange={onValueChange || onChange}
      value={[selectedValue || value]}
      okText="Done"
      dismissText="Cancel"
      {...props}
    >
      <List.Item>{placeholder}</List.Item>
    </Picker>
  );
};

Select.propTypes = {
  data: PropTypes.array.isRequired,
  onValueChange: PropTypes.func,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  selectedValue: PropTypes.string
};

export default Select;
