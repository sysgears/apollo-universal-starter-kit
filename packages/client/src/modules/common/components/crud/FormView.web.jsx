import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import { createFormFields } from '../../util';
import { Form, Button, Alert } from '../web';

const FormView = ({ handleSubmit, submitting, onSubmit, data, error, schema }) => {
  return (
    <Form name="post" onSubmit={handleSubmit(onSubmit)}>
      {createFormFields(schema, data)}
      {error && <Alert color="error">{error}</Alert>}
      <Button color="primary" type="submit" disabled={submitting}>
        Save
      </Button>
    </Form>
  );
};

FormView.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  data: PropTypes.object,
  schema: PropTypes.object,
  error: PropTypes.string
};

export default reduxForm({
  form: 'form'
})(FormView);
