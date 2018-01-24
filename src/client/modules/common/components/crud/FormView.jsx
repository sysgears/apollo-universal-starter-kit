import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import { createFormFields } from '../../util';
import { FormView, FormButton } from '../native';

const Form = ({ handleSubmit, valid, onSubmit, schema }) => {
  return (
    <FormView>
      {createFormFields(schema)}
      <FormButton onPress={handleSubmit(onSubmit)} disabled={!valid}>
        Save
      </FormButton>
    </FormView>
  );
};

Form.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  schema: PropTypes.object,
  valid: PropTypes.bool
};

export default reduxForm({
  form: 'form',
  enableReinitialize: true
})(Form);
