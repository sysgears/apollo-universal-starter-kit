import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Keyboard, View, StyleSheet, Text } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as Yup from 'yup';

import Field from '../../../utils/FieldAdapter';
import { RenderField, FormView, Button, Modal, danger, success } from '../../common/components/native';
import { placeholderColor, submit } from '../../common/components/native/styles';
import { normalizeErrorsForFormik } from '../../../../../common/utils';

const ContactForm = ({ values, handleSubmit, t, errors, status, setStatus }) => (
  <FormView contentContainerStyle={{ flexGrow: 1 }} style={styles.formView}>
    <Modal isVisible={status && status.showModal} onBackdropPress={setStatus}>
      <View style={styles.modal}>
        <Text style={styles.modalText}>{errors.serverError ? errors.serverError : t('successMsg')}</Text>
        <Button type={errors.serverError ? danger : success} onPress={setStatus}>
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
          placeholder={t('form.nameField.name')}
          value={values.name}
          placeholderTextColor={placeholderColor}
        />
        <Field
          name="email"
          component={RenderField}
          type="text"
          placeholder={t('form.emailField.name')}
          value={values.email}
          keyboardType="email-address"
          placeholderTextColor={placeholderColor}
        />
        <Field
          name="content"
          component={RenderField}
          type="textarea"
          placeholder={t('form.contentField.name')}
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
  async handleSubmit(values, { resetForm, setErrors, setStatus, props }) {
    const { t, contact } = props;

    Keyboard.dismiss();
    try {
      const { data } = await contact({ variables: { input: values } });

      if (data.contact.errors) {
        setErrors(normalizeErrorsForFormik(data.contact.errors));
      } else {
        resetForm();
        setStatus({ showModal: true });
      }
    } catch (e) {
      setStatus({ showModal: false });
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
