import React from 'react';
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';

const ADOption = Select.Option;

const Option = ({ children, ...props }) => {
  return <ADOption {...props}>{children}</ADOption>;
};

Option.propTypes = {
  children: PropTypes.node
};

export default Option;
