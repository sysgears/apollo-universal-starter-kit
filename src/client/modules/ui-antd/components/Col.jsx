import React from 'react';
import PropTypes from 'prop-types';
import ADCol from 'antd/lib/col';

const Col = ({ children, xs, ...props }) => {
  return (
    <ADCol span={xs} {...props}>
      {children}
    </ADCol>
  );
};

Col.propTypes = {
  children: PropTypes.node,
  xs: PropTypes.string
};

export default Col;
