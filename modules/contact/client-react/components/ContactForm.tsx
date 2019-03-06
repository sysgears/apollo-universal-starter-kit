import React from 'react';
import { withFormik, FormikProps } from 'formik';
import { isFormError } from '@gqlapp/forms-client-react';
import { contactFormSchema } from '@gqlapp/contact-common';
import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { validate } from '@gqlapp/validation-common-react';
import { FieldAdapter as Field } from '@gqlapp/forms-client-react';

import { Form, RenderField, Button, Alert } from '@gqlapp/look-client-react';
import { ContactForm } from '../types';

interface ContactFormProps {
  t: TranslateFunction;
  onSubmit: (values: ContactForm) => void;
}

const ContactForm = ({
  values,
  handleSubmit,
  t,
  status,
  errors
}: FormikProps<ContactForm> & ContactFormProps & { errors: { errorMsg: string } }) => (
  <Form name="contact" onSubmit={handleSubmit}>
    {status && status.sent && <Alert color="success">{t('successMsg')}</Alert>}
    <Field name="name" component={RenderField} type="text" label={t('form.field.name')} value={values.name} />
    <Field name="email" component={RenderField} type="text" label={t('form.field.email')} value={values.email} />
    <Field
      name="content"
      component={RenderField}
      type="textarea"
      label={t('form.field.content')}
      value={values.content}
    />
    <div className="text-center">
      {errors && errors.errorMsg && <Alert color="error">{errors.errorMsg}</Alert>}
      <Button color="primary" type="submit">
        {t('form.btnSubmit')}
      </Button>
    </div>
  </Form>
);

const ContactFormWithFormik = withFormik<ContactFormProps, ContactForm>({
  enableReinitialize: true,
  mapPropsToValues: () => ({ content: '', email: '', name: '' }),
  async handleSubmit(values, { resetForm, setErrors, setStatus, props: { onSubmit } }) {
    try {
      await onSubmit(values);
      resetForm();
      setStatus({ sent: true });
    } catch (e) {
      if (isFormError(e)) {
        setErrors(e.errors);
      } else {
        throw e;
      }
      setStatus({ sent: false });
    }
  },
  validate: values => validate(values, contactFormSchema),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
