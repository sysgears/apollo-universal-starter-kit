import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label } from 'reactstrap';

const FormItem = ({ children, labelCol, wrapperCol, validateStatus, label, ...props }) => {
  return (
    <FormGroup {...props}>
      {label && (
        <Label size="md">
          {label}
          :&nbsp;
        </Label>
      )}
      {children}
    </FormGroup>
  );
};

FormItem.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  labelCol: PropTypes.any,
  wrapperCol: PropTypes.any,
  validateStatus: PropTypes.any
};

export default FormItem;
