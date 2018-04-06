import React from 'react';
import PropTypes from 'prop-types';
import ADInputItem from 'antd-mobile/lib/input-item';

const InputItem = ({ children, error, ...props }) => {
  return (
    <ADInputItem error={!!error} {...props}>
      {children}
    </ADInputItem>
  );
};

InputItem.propTypes = {
  children: PropTypes.node,
  error: PropTypes.string
};

export default InputItem;
