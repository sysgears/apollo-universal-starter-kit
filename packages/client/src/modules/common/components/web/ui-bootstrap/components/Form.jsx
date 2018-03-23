import React from 'react';
import PropTypes from 'prop-types';
import { Form as RSForm } from 'reactstrap';

const Form = props => {
  const { children, layout, ...rest } = props;
  let inline = false;
  if (layout === 'inline') {
    inline = true;
  }
  return (
    <RSForm {...rest} inline={inline}>
      {children}
    </RSForm>
  );
};

Form.propTypes = {
  children: PropTypes.node,
  layout: PropTypes.string,
  type: PropTypes.string
};

export default Form;
