import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Keyboard, View, StyleSheet, Text } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { RenderField, FormView, Button } from '../../common/components/native';
import { placeholderColor, submit } from '../../common/components/native/styles';
// import { email, minLength, required, validateForm } from '../../../../../common/validation';
//
// const contactFormSchema = {
//   name: [required, minLength(3)],
//   email: [required, email],
//   content: [required, minLength(10)]
// };

const ContactForm = ({ values, handleSubmit, t, errors, status }) => {
  return (
    <FormView contentContainerStyle={{ flexGrow: 1 }} style={styles.formView}>
      {status && status.sent && <Text>{t('form.submitMsg')}</Text>}
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
          {errors._error && <Text color="error">{errors._error}</Text>}
          <Button onPress={handleSubmit}>{t('form.btnSubmit')}</Button>
        </View>
      </View>
      <KeyboardSpacer />
    </FormView>
  );
};

ContactForm.propTypes = {
  handleSubmit: PropTypes.func,
  errors: PropTypes.object,
  status: PropTypes.object,
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
  async handleSubmit(
    values,
    {
      resetForm,
      setErrors,
      setStatus,
      props: { onSubmit }
    }
  ) {
    Keyboard.dismiss();

    try {
      await onSubmit(values);
      resetForm();
      setStatus({ sent: true });
    } catch (e) {
      setStatus({ sent: false });
      setErrors(e);
    }
  },
  // validate: values => validateForm(values, contactFormSchema),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default translate('contact')(ContactFormWithFormik(ContactForm));
