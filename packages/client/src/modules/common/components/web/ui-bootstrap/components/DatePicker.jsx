import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { Input } from 'reactstrap';
import PropTypes from 'prop-types';

const DatePicker = ({ value, ...props }) => {
  return <ReactDatePicker {...props} selected={value} customInput={<Input />} />;
};

DatePicker.propTypes = {
  value: PropTypes.object
};

export default DatePicker;
