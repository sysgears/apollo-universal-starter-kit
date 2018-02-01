import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Yup from 'yup';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, FormButton } from '../../common/components/native';

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

const ContactForm = ({ values, handleSubmit }) => {
  return (
    <FormView>
      <Field name="name" component={RenderField} type="text" label="Name" value={values.name} />
      <Field name="email" component={RenderField} type="text" label="Email" value={values.email} />
      <Field name="content" component={RenderField} type="textarea" label="Content" value={values.content} />
      <FormButton onPress={handleSubmit}>Send</FormButton>
    </FormView>
  );
};

ContactForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  sent: PropTypes.bool,
  values: PropTypes.object
};

const ContactFormWithFormik = withFormik({
  validationSchema: validationSchema,
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm();
  },
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
