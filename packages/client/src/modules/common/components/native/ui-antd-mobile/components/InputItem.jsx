import React from 'react';
import PropTypes from 'prop-types';
import ADInputItem from 'antd-mobile/lib/input-item';

const InputItem = ({ children, ...props }) => {
  return <ADInputItem {...props}>{children}</ADInputItem>;
};

InputItem.propTypes = {
  children: PropTypes.node
};

export default InputItem;
