import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

const Select = ({ children, ...props }) => {
  return (
    <Input {...props} type="select">
      {children}
    </Input>
  );
};

Select.propTypes = {
  children: PropTypes.node
};

export default Select;
