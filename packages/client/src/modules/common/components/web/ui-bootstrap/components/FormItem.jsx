import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label } from 'reactstrap';

const FormItem = ({ children, label, ...props }) => {
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
  label: PropTypes.string
};

export default FormItem;
