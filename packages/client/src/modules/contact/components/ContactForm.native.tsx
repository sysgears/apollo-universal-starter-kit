import React from 'react';
import { withFormik, FormikProps } from 'formik';
import { Keyboard } from 'react-native';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, FormButton } from '../../common/components/native';
import { email, minLength, required, validateForm } from '../../../../../common/validation';
import { Contact, ContactFormProps } from '../types';

const contactFormSchema: any = {
  name: [required, minLength(3)],
  email: [required, email],
  content: [required, minLength(10)]
};

const validate = (values: Contact) => validateForm(values, contactFormSchema);

const ContactForm = ({ values, handleSubmit }: FormikProps<Contact>) => {
  return (
    <FormView>
      <Field name="name" component={RenderField} type="text" label="Name" value={values.name} />
      <Field name="email" component={RenderField} type="text" label="Email" value={values.email} />
      <Field name="content" component={RenderField} type="textarea" label="Content" value={values.content} />
      <FormButton onPress={handleSubmit}>Send</FormButton>
    </FormView>
  );
};

const ContactFormWithFormik = withFormik<ContactFormProps, Contact>({
  mapPropsToValues: () => ({ content: '', email: '', name: '' }),
  async handleSubmit(values: Contact, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    Keyboard.dismiss();
    resetForm();
  },
  validate: (values: Contact) => validate(values),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
