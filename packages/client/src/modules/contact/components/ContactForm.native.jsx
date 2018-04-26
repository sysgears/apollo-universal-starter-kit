import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Keyboard } from 'react-native';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, FormButton, placeholderColor } from '../../common/components/native';
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
      <Field
        name="name"
        component={RenderField}
        type="text"
        placeholder={t('form.field.name')}
        value={values.name}
        placeholderTextColor={placeholderColor}
      />
      <Field
        name="email"
        component={RenderField}
        type="text"
        placeholder={t('form.field.email')}
        value={values.email}
        keyboardType="email-address"
        placeholderTextColor={placeholderColor}
      />
      <Field
        name="content"
        component={RenderField}
        type="textarea"
        placeholder={t('form.field.content')}
        value={values.content}
        placeholderTextColor={placeholderColor}
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
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    Keyboard.dismiss();
    await onSubmit(values);
    resetForm();
  },
  validate: values => validate(values),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default translate('contact')(ContactFormWithFormik(ContactForm));
