import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormFeedback } from 'reactstrap';

const RenderErrors = ({ errors }) => {
  if (errors) {
    return (
      <FormGroup color="danger">
        <FormFeedback>{errors.map(error => <li key={error.field}>{error.message}</li>)}</FormFeedback>
      </FormGroup>
    );
  } else {
    return null;
  }
};

RenderErrors.propTypes = {
  errors: PropTypes.array
};

export default RenderErrors;
