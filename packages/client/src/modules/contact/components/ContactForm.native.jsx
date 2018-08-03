import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Keyboard, View, StyleSheet, Text } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import Field from '../../../utils/FieldAdapter';
import { RenderField, FormView, Button, Modal, danger, success } from '../../common/components/native';
import { placeholderColor, submit } from '../../common/components/native/styles';
import { email, minLength, required, validateForm } from '../../../../../common/validation';

const contactFormSchema = {
  name: [required, minLength(3)],
  email: [required, email],
  content: [required, minLength(10)]
};

const ContactForm = ({ values, handleSubmit, t, errors, status, setStatus }) => (
  <FormView contentContainerStyle={{ flexGrow: 1 }} style={styles.formView}>
    <Modal isVisible={status && status.showModal} onBackdropPress={setStatus}>
      <View style={styles.modal}>
        <Text style={styles.modalText}>{errors._error ? errors._error : t('successMsg')}</Text>
        <Button type={errors._error ? danger : success} onPress={setStatus}>
          {t('modal.btnMsg')}
        </Button>
      </View>
    </Modal>
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

ContactForm.propTypes = {
  handleSubmit: PropTypes.func,
  setStatus: PropTypes.func,
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
  modal: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    padding: 15
  },
  modalText: {
    textAlign: 'center',
    paddingBottom: 15
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
    } catch (e) {
      setErrors(e);
    }

    setStatus({ showModal: true });
  },
  validate: values => validateForm(values, contactFormSchema),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
