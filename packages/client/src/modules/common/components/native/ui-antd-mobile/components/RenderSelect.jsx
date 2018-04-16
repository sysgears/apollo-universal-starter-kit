import React from 'react';
import PropTypes from 'prop-types';
import { Picker, List } from 'antd-mobile';

const RenderSelect = ({ placeholder, onValueChange, selectedValue, value, onChange, ...props }) => {
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

RenderSelect.propTypes = {
  onValueChange: PropTypes.func,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  selectedValue: PropTypes.string
};

export default RenderSelect;
