import React from 'react';
import { withFormik, FormikProps } from 'formik';

import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '../../common/components/web';
import { contactFormSchema } from '../../../../../server/src/modules/contact/contactFormSchema';
import { validate } from '../../../../../common/modules/validation';
import { TranslateFunction } from '../../../i18n';
import { ContactFields } from '../types';

interface ContactFormProps {
  t: TranslateFunction;
  // TODO: types
  onSubmit: (values: ContactFields) => Promise<void>;
}

const ContactForm = ({ values, handleSubmit, t, status }: FormikProps<ContactFields> & ContactFormProps) => (
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

const ContactFormWithFormik = withFormik<ContactFormProps, ContactFields>({
  enableReinitialize: true,
  mapPropsToValues: () => ({ content: '', email: '', name: '' }),
  async handleSubmit(values, { resetForm, setStatus, props: { onSubmit } }) {
    try {
      await onSubmit(values);
      resetForm();
      setStatus({ sent: true });
    } catch (e) {
      setStatus({ sent: false, serverError: 'SERVER ERROR' });
    }
  },
  validate: values => validate(values, contactFormSchema),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
