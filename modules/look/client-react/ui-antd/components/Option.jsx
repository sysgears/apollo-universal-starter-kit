import React from 'react';
import PropTypes from 'prop-types';
//import { Select } from 'antd';

//const ADOption = Select.Option;

const Option = ({ children, ...props }) => {
  return <option {...props}>{children}</option>;
};

Option.propTypes = {
  children: PropTypes.node
};

export default Option;
