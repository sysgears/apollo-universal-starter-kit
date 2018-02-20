import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import { onSubmit } from '../../../../utils/crud';
import { createFormFields, mapFormPropsToValues } from '../../util';
import { Form, FormItem, Button, Alert } from '../web';
//import { minLength, required, validateForm } from '../../../../../../common/validation';

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

//const formSchema = {
//  name: [required, minLength(3)]
//};

//const validate = values => validateForm(values, formSchema);

const FormView = ({
  handleChange,
  setFieldValue,
  handleBlur,
  setFieldTouched,
  handleSubmit,
  values,
  data,
  error,
  schema
}) => {
  return (
    <Form name="post" onSubmit={handleSubmit}>
      {createFormFields(handleChange, setFieldValue, handleBlur, setFieldTouched, schema, values, data, formItemLayout)}
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
  handleChange: PropTypes.func,
  setFieldValue: PropTypes.func,
  handleBlur: PropTypes.func,
  setFieldTouched: PropTypes.func,
  handleSubmit: PropTypes.func,
  data: PropTypes.object,
  schema: PropTypes.object,
  values: PropTypes.object,
  error: PropTypes.string
};

const FormWithFormik = withFormik({
  mapPropsToValues: ({ schema, data: { node } }) => mapFormPropsToValues(schema, node),
  async handleSubmit(values, { props: { schema, updateEntry, createEntry, title, data: { node } } }) {
    await onSubmit(schema, values, updateEntry, createEntry, title, node);
  },
  //validate: values => validate(values),
  displayName: 'Form' // helps with React DevTools
});

export default FormWithFormik(FormView);
