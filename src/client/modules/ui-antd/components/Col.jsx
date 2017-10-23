import React from 'react';
import PropTypes from 'prop-types';
import { Col as RSCol } from 'antd';

const Col = ({ children, xs, ...props }) => {
  return (
    <RSCol span={xs} {...props}>
      {children}
    </RSCol>
  );
};

Col.propTypes = {
  children: PropTypes.node,
  xs: PropTypes.string
};

export default Col;
