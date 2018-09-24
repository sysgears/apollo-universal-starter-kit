import React from 'react';
import PropTypes from 'prop-types';
import { Col as ADCol } from 'antd';

const Col = ({ children, xs, md = 12, ...props }) => {
  return (
    <ADCol span={(xs * 2).toString()} md={md * 2} {...props}>
      {children}
    </ADCol>
  );
};

Col.propTypes = {
  children: PropTypes.node,
  xs: PropTypes.number
};

export default Col;
