import React from 'react';
import PropTypes from 'prop-types';
import { FieldError } from '@module/validation-common-react';

export default Component => {
  const handleError = async (asyncCallback, messageError) => {
    const result = await asyncCallback();
    const errors = new FieldError(result.errors);

    if (errors.hasAny()) {
      throw { ...errors.errors, messageError };
    }

    return result;
  };

  handleError.propTypes = {
    asyncCallback: PropTypes.func,
    messageError: PropTypes.string
  };

  const FormikMessageHandler = props => <Component {...props} handleError={handleError} />;

  return FormikMessageHandler;
};
