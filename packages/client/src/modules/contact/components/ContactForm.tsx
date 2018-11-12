import React from 'react';
import { withFormik, FormikProps } from 'formik';

import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '../../common/components/web';
// import { contactFormSchema } from '../../../../../server/src/modules/contact/contactFormSchema';
import { validate } from '../../../../../common/modules/validation';
import { transformValidationMessagesFromGraphql } from '../../../../../common/utils';
import { TranslateFunction } from '../../../i18n';
import { ContactForm } from '../types';
// import { email, minLength, required } from '../../../../../common/modules/validation';

const contactFormSchema = {
  // name: [required, minLength(1)],
  // email: [required, email],
  // content: [required, minLength(10)]
};

interface ContactFormProps {
  t: TranslateFunction;
  onSubmit: (values: ContactForm) => Promise<{ errors: Array<{ field: string; message: string }> }>;
}

const ContactForm = ({ values, handleSubmit, t, status }: FormikProps<ContactForm> & ContactFormProps) => (
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
      {status && status.serverError && <Alert color="error">{status.serverError}</Alert>}
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
    const { errors } = await onSubmit(values);
    if (errors) {
      setStatus({ sent: false });
      const errorstr = transformValidationMessagesFromGraphql(errors);
      setErrors(errorstr);
    } else {
      setStatus({ sent: true });
      resetForm();
    }
  },
  validate: values => validate(values, contactFormSchema),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
