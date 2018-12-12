import React from 'react';
import { withFormik, FormikProps } from 'formik';

import { contactFormSchema } from '@module/contact-server-ts';
import { TranslateFunction } from '@module/i18n-client-react';
import { validate, FieldError } from '@module/validation-common-react';
import Field from '../../../../packages/client/src/utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '@module/look-client-react';
import { ContactForm } from '../types';

interface ContactFormProps {
  t: TranslateFunction;
  onSubmit: (values: ContactForm) => Promise<{ errors: Array<{ field: string; message: string }> }>;
}

const ContactForm = ({
  values,
  handleSubmit,
  t,
  status,
  errors
}: FormikProps<ContactForm> & ContactFormProps & { errors: { serverError: string } }) => (
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
      {errors && errors.serverError && <Alert color="error">{errors.serverError}</Alert>}
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
    const errors = new FieldError((await onSubmit(values)).errors);

    if (errors.hasAny()) {
      setStatus({ sent: false });
      setErrors(errors.errors);
    } else {
      resetForm();
      setStatus({ sent: true });
    }
  },
  validate: values => validate(values, contactFormSchema),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
