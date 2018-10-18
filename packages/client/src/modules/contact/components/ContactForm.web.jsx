import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import Field from '../../../utils/FieldAdapter';
import { normalizeErrorsForFormik } from '../../../../../common/utils';
import { Form, RenderField, Button, Alert } from '../../common/components/web';

const ContactForm = ({ values, handleSubmit, errors, t, status }) => (
  <Form name="contact" onSubmit={handleSubmit}>
    {status && status.sent && <Alert color="success">{t('successMsg')}</Alert>}
    <Field name="name" component={RenderField} type="text" label={t('form.nameField.name')} value={values.name} />
    <Field name="email" component={RenderField} type="text" label={t('form.emailField.name')} value={values.email} />
    <Field
      name="content"
      component={RenderField}
      type="textarea"
      label={t('form.contentField.name')}
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
  async handleSubmit(values, { resetForm, setErrors, setStatus, props }) {
    const { t, contact } = props;

    try {
      const { data } = await contact({ variables: { input: values } });

      if (data.contact.errors) {
        setErrors(normalizeErrorsForFormik(data.contact.errors));
      } else {
        resetForm();
        setStatus({ sent: true });
      }
    } catch (e) {
      setStatus({ sent: false });
      setErrors({ serverError: t('serverError') });
    }
  },
  validationSchema: ({ t }) => {
    return Yup.object().shape({
      name: Yup.string()
        .min(3, t('form.nameField.errors.min', { min: 3 }))
        .max(50, t('form.nameField.errors.max', { max: 50 }))
        .required(t('form.required')),
      email: Yup.string()
        .email(t('form.emailField.errors.invalid'))
        .required(t('form.required')),
      content: Yup.string()
        .min(2, t('form.contentField.errors.min', { min: 2 }))
        .max(1000, t('form.contentField.errors.min', { max: 1000 }))
        .required(t('form.required'))
    });
  },
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
