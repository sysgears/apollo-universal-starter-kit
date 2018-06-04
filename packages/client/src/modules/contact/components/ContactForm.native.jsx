import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Keyboard, View, StyleSheet } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { RenderField, FormView, Button } from '../../common/components/native';
import { placeholderColor, submit } from '../../common/components/native/styles';
import { email, minLength, required, validateForm } from '../../../../../common/validation';

const contactFormSchema = {
  name: [required, minLength(3)],
  email: [required, email],
  content: [required, minLength(10)]
};

const validate = values => validateForm(values, contactFormSchema);

const ContactForm = ({ values, handleSubmit, t }) => {
  return (
    <FormView contentContainerStyle={{ flexGrow: 1 }} style={styles.formView}>
      <View style={styles.formContainer}>
        <View>
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
        </View>
        <View style={styles.submit}>
          <Button onPress={handleSubmit}>{t('form.btnSubmit')}</Button>
        </View>
      </View>
      <KeyboardSpacer />
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

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 15,
    flex: 1,
    justifyContent: 'center'
  },
  formView: {
    flex: 1,
    alignSelf: 'stretch'
  },
  submit
});

const ContactFormWithFormik = withFormik({
  mapPropsToValues: () => ({ content: '', email: '', name: '' }),

  handleSubmit(
    values,
    {
      resetForm,
      props: { onSubmit }
    }
  ) {
    Keyboard.dismiss();
    onSubmit(values);
    resetForm();
  },
  validate: values => validate(values),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default translate('contact')(ContactFormWithFormik(ContactForm));
