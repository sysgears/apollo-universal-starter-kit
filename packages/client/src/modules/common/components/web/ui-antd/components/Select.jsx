import React from 'react';
import PropTypes from 'prop-types';
import { Select as ADSelect } from 'antd';

const Select = ({ children, ...props }) => {
  return <ADSelect {...props}>{children}</ADSelect>;
};

Select.propTypes = {
  children: PropTypes.node
};

export default Select;
