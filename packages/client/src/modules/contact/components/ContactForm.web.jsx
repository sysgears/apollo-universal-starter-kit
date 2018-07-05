import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '../../common/components/web';
import { email, minLength, required, validateForm } from '../../../../../common/validation';

const contactFormSchema = {
  name: [required, minLength(3)],
  email: [required, email],
  content: [required, minLength(10)]
};

const validate = values => validateForm(values, contactFormSchema);

const ContactForm = ({ values, handleSubmit, error, sent, t }) => {
  return (
    <Form name="contact" onSubmit={handleSubmit}>
      {sent && <Alert color="success">{t('form.submitMsg')}</Alert>}
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
        {error && <Alert color="error">{error}</Alert>}
        <Button color="primary" type="submit">
          {t('form.btnSubmit')}
        </Button>
      </div>
    </Form>
  );
};

ContactForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  sent: PropTypes.bool,
  values: PropTypes.object,
  t: PropTypes.func
};

const ContactFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ content: '', email: '', name: '' }),
  async handleSubmit(
    values,
    {
      resetForm,
      props: { onSubmit }
    }
  ) {
    await onSubmit(values);
    resetForm();
  },
  validate: values => validate(values),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default translate('contact')(ContactFormWithFormik(ContactForm));
