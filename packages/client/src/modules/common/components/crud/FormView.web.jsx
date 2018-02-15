import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import { createFormFields } from '../../util';
import { Form, FormItem, Button, Alert } from '../web';
import { minLength, required, validateForm } from '../../../../../../common/validation';

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

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

const formSchema = {
  name: [required, minLength(3)]
};

const validate = values => validateForm(values, formSchema);

const FormView = ({ handleSubmit, data, error, schema }) => {
  return (
    <Form name="post" onSubmit={handleSubmit}>
      {createFormFields(schema, data, formItemLayout)}
      {error && <Alert color="error">{error}</Alert>}
      <FormItem {...tailFormItemLayout}>
        <Button color="primary" type="submit">
          Save
        </Button>
      </FormItem>
    </Form>
  );
};

FormView.propTypes = {
  handleSubmit: PropTypes.func,
  data: PropTypes.object,
  schema: PropTypes.object,
  error: PropTypes.string
};

const FormWithFormik = withFormik({
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm();
  },
  validate: values => validate(values),
  displayName: 'Form' // helps with React DevTools
});

export default FormWithFormik(FormView);
