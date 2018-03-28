import React from 'react';
import { withFormik, FormikProps } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '../../common/components/web';
import { email, minLength, required, validateForm } from '../../../../../common/validation';
import { Contact, ContactFormProps } from '../types';

const contactFormSchema: any = {
  name: [required, minLength(3)],
  email: [required, email],
  content: [required, minLength(10)]
};

const validate = (values: Contact) => validateForm(values, contactFormSchema);

const ContactForm = ({ values, handleSubmit, error, sent }: ContactFormProps & FormikProps<Contact>) => {
  return (
    <Form name="contact" onSubmit={handleSubmit}>
      {sent && <Alert color="success">Thank you for contacting us!</Alert>}
      <Field name="name" component={RenderField} type="text" label="Name" value={values.name} />
      <Field name="email" component={RenderField} type="text" label="Email" value={values.email} />
      <Field name="content" component={RenderField} type="textarea" label="Content" value={values.content} />
      <div className="text-center">
        {error && <Alert color="error">{error}</Alert>}
        <Button color="primary" type="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
};

const ContactFormWithFormik = withFormik<ContactFormProps, Contact>({
  enableReinitialize: true,
  mapPropsToValues: () => ({ content: '', email: '', name: '' }),
  async handleSubmit(values: Contact, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm();
  },
  validate: (values: Contact) => validate(values),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
