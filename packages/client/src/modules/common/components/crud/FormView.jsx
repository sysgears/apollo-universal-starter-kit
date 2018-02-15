import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import { createFormFields } from '../../util';
import { FormView, FormButton } from '../native';
import { minLength, required, validateForm } from '../../../../../../common/validation';

const formSchema = {
  name: [required, minLength(3)]
};

const validate = values => validateForm(values, formSchema);

const Form = ({ handleChange, handleSubmit, schema }) => {
  return (
    <FormView>
      {createFormFields(handleChange, schema)}
      <FormButton onPress={handleSubmit}>Save</FormButton>
    </FormView>
  );
};

Form.propTypes = {
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  schema: PropTypes.object
};

const FormWithFormik = withFormik({
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm();
  },
  validate: values => validate(values),
  displayName: 'Form' // helps with React DevTools
});

export default FormWithFormik(Form);
