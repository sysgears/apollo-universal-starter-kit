import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Yup from 'yup';
import Field from '../../../utils/FieldAdaptor';
import { Form, RenderField, Button, Alert } from '../../common/components/web';

const nameMinLength = 3;
const contentMinLength = 3;
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(nameMinLength, `Must be ${nameMinLength} characters or more`)
    .required('Name is required!'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required!'),
  content: Yup.string()
    .min(contentMinLength, `Must be ${contentMinLength} characters or more`)
    .required('Content is required!')
});

const ContactForm = ({ values, handleSubmit, error, sent, handleChange }) => {
  return (
    <Form name="contact" onSubmit={handleSubmit}>
      {sent && <Alert color="success">Thank you for contacting us!</Alert>}
      <Field name="name" component={RenderField} type="text" label="Name" value={values.name} onChange={handleChange} />
      <Field
        name="email"
        component={RenderField}
        type="text"
        label="Email"
        value={values.email}
        onChange={handleChange}
      />
      <Field
        name="content"
        component={RenderField}
        type="textarea"
        label="Content"
        value={values.content}
        onChange={handleChange}
      />
      <div className="text-center">
        {error && <Alert color="error">{error}</Alert>}
        <Button color="primary" type="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
};

ContactForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  sent: PropTypes.bool,
  values: PropTypes.object
};

const ContactFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ content: '', email: '', name: '' }),
  validationSchema: validationSchema,
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm();
  },
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
