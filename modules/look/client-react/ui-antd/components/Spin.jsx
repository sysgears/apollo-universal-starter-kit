import React from 'react';
import PropTypes from 'prop-types';
import { Spin as ADSpin } from 'antd';

const Form = ({ children, ...props }) => {
  return <ADSpin {...props}>{children}</ADSpin>;
};

Form.propTypes = {
  children: PropTypes.node
};

export default Form;
