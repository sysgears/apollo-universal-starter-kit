import React from 'react';
import PropTypes from 'prop-types';
import { Col as ADCol } from 'antd';

const Col = ({ children, xs, md, ...props }) => {
  const newProps = props;
  if (xs) newProps.xs = xs * 2;
  if (md) newProps.md = md * 2;
  return <ADCol {...newProps}>{children}</ADCol>;
};

Col.propTypes = {
  children: PropTypes.node,
  xs: PropTypes.number,
  md: PropTypes.number
};

export default Col;
