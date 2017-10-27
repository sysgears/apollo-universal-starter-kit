import React from 'react';
import PropTypes from 'prop-types';
//import ADSelect from 'antd/lib/select';

const Select = ({ children, ...props }) => {
  return <select {...props}>{children}</select>;
};

Select.propTypes = {
  children: PropTypes.node
};

export default Select;
