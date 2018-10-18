import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '../../common/components/web';

const ContactForm = ({ values, handleSubmit, errors, t, status }) => (
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
      {errors._error && <Alert color="error">{errors._error}</Alert>}
      <Button color="primary" type="submit">
        {t('form.btnSubmit')}
      </Button>
    </div>
  </Form>
);

ContactForm.propTypes = {
  values: PropTypes.object,
  handleSubmit: PropTypes.func,
  errors: PropTypes.object,
  status: PropTypes.object,
  t: PropTypes.func
};

const ContactFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ content: '', email: '', name: '' }),
  async handleSubmit(
    values,
    {
      resetForm,
      setErrors,
      setStatus,
      props: { onSubmit }
    }
  ) {
    try {
      await onSubmit(values);
      resetForm();
      setStatus({ sent: true });
    } catch (e) {
      setStatus({ sent: false });
      setErrors(e);
    }
  },
  validationSchema: ({ t }) => {
    return Yup.object().shape({
      name: Yup.string()
        .min(3, t('form.field.name'))
        .max(50, 'Too Long!')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email')
        .required('Required'),
      content: Yup.string()
        .min(2, 'Too Short!')
        .max(1000, 'Too Long!')
        .required('Required')
    });
  },
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
