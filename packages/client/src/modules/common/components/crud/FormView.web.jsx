import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import { createFormFields } from '../../util';
import { Form, FormItem, Button, Alert } from '../web';

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 6
    }
  }
};

const FormView = ({ handleSubmit, submitting, onSubmit, data, error, schema }) => {
  return (
    <Form name="post" onSubmit={handleSubmit(onSubmit)}>
      {createFormFields(schema, data)}
      {error && <Alert color="error">{error}</Alert>}
      <FormItem {...tailFormItemLayout}>
        <Button color="primary" type="submit" disabled={submitting}>
          Save
        </Button>
      </FormItem>
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
