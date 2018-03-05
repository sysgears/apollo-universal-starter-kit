import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Keyboard } from 'react-native';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, FormButton } from '../../common/components/native';
import { email, minLength, required, validateForm } from '../../../../../common/validation';

const contactFormSchema = {
  name: [required, minLength(3)],
  email: [required, email],
  content: [required, minLength(10)]
};

const validate = values => validateForm(values, contactFormSchema);

const ContactForm = ({ values, handleSubmit, setFieldValue, setFieldTouched }) => {
  return (
    <FormView>
      <Field
        name="name"
        component={RenderField}
        type="text"
        label="Name"
        value={values.name}
        onChangeText={text => setFieldValue('name', text)}
        onBlur={() => setFieldTouched('name', true)}
      />
      <Field
        name="email"
        component={RenderField}
        type="text"
        label="Email"
        value={values.email}
        onChangeText={text => setFieldValue('email', text)}
        onBlur={() => setFieldTouched('email', true)}
      />
      <Field
        name="content"
        component={RenderField}
        type="textarea"
        label="Content"
        value={values.content}
        onChangeText={text => setFieldValue('content', text)}
        onBlur={() => setFieldTouched('content', true)}
      />
      <FormButton onPress={handleSubmit}>Send</FormButton>
    </FormView>
  );
};

ContactForm.propTypes = {
  handleSubmit: PropTypes.func,
  setFieldTouched: PropTypes.func,
  setFieldValue: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  sent: PropTypes.bool,
  values: PropTypes.object
};

const ContactFormWithFormik = withFormik({
  mapPropsToValues: () => ({ content: '', email: '', name: '' }),
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    Keyboard.dismiss();
    resetForm();
  },
  validate: values => validate(values),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
