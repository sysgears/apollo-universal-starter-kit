import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '../../common/components/web';
import { email, minLength, required, validateForm } from '../../../../../common/validation';

const contactFormSchema = {
  name: [required, minLength(3)],
  email: [required, email],
  content: [required, minLength(10)]
};

const validate = values => validateForm(values, contactFormSchema);

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
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm();
  },
  validate: values => validate(values),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
