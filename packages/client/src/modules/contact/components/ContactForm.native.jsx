import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Keyboard } from 'react-native';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, FormButton } from '../../common/components/native';
import { email, minLength, required, validateForm } from '../../../../../common/validation';

const contactFormSchema = {
  name: [required, minLength(3)],
  email: [required, email],
  content: [required, minLength(10)]
};

const validate = values => validateForm(values, contactFormSchema);

const ContactForm = ({ values, handleSubmit, t }) => {
  return (
    <FormView>
      <Field name="name" component={RenderField} type="text" label={t('form.field.name')} value={values.name} />
      <Field name="email" component={RenderField} type="text" label={t('form.field.email')} value={values.email} />
      <Field
        name="content"
        component={RenderField}
        type="textarea"
        label={t('form.field.content')}
        value={values.content}
      />
      <FormButton onPress={handleSubmit}>{t('form.btnSubmit')}</FormButton>
    </FormView>
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
  mapPropsToValues: () => ({ content: '', email: '', name: '' }),
  async handleSubmit(
    values,
    {
      resetForm,
      props: { onSubmit }
    }
  ) {
    await onSubmit(values);
    Keyboard.dismiss();
    resetForm();
  },
  validate: values => validate(values),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default translate('contact')(ContactFormWithFormik(ContactForm));
