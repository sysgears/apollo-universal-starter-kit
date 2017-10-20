import React from 'react';
import PropTypes from 'prop-types';

const RenderErrors = ({ errors }) => {
  if (errors) {
    return (
      <div color="danger">
        <p>{errors.map(error => <li key={error.field}>{error.message}</li>)}</p>
      </div>
    );
  } else {
    return null;
  }
};

RenderErrors.propTypes = {
  errors: PropTypes.array
};

export default RenderErrors;
