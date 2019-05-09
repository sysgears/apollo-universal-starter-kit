import React from 'react';
import { FormikProps, withFormik } from 'formik';
import { Keyboard, View, StyleSheet, Text } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { isFormError } from '@gqlapp/forms-client-react';
import { contactFormSchema } from '@gqlapp/contact-common';
import { validate } from '@gqlapp/validation-common-react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { FieldAdapter as Field } from '@gqlapp/forms-client-react';

import { RenderField, FormView, Button, Modal, danger, success, lookStyles } from '@gqlapp/look-client-react-native';
import { ContactForm } from '../types';

interface ContactFormProps {
  t: TranslateFunction;
  onSubmit: (values: ContactForm) => Promise<{ errors: Array<{ field: string; message: string }> }>;
}

const ContactForm = ({
  values,
  handleSubmit,
  t,
  errors,
  status,
  setStatus
}: FormikProps<ContactForm> & ContactFormProps & { errors: { serverError: string } }) => (
  <FormView contentContainerStyle={{ flexGrow: 1 }} style={styles.formView}>
    <Modal isVisible={status && status.showModal} onBackdropPress={setStatus}>
      <View style={styles.modal}>
        <Text style={styles.modalText}>{errors && errors.serverError ? errors.serverError : t('successMsg')}</Text>
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
          placeholder={t('form.field.name')}
          value={values.name}
          placeholderTextColor={lookStyles.placeholderColor}
        />
        <Field
          name="email"
          component={RenderField}
          type="text"
          placeholder={t('form.field.email')}
          value={values.email}
          keyboardType="email-address"
          placeholderTextColor={lookStyles.placeholderColor}
        />
        <Field
          name="content"
          component={RenderField}
          type="textarea"
          placeholder={t('form.field.content')}
          value={values.content}
          placeholderTextColor={lookStyles.placeholderColor}
        />
      </View>
      <View style={lookStyles.submit}>
        <Button onPress={handleSubmit}>{t('form.btnSubmit')}</Button>
      </View>
    </View>
    <KeyboardSpacer />
  </FormView>
);

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
  submit: lookStyles.submit
});

const ContactFormWithFormik = withFormik<ContactFormProps, ContactForm>({
  mapPropsToValues: () => ({ content: '', email: '', name: '' }),
  async handleSubmit(values, { resetForm, setErrors, setStatus, props: { onSubmit } }) {
    Keyboard.dismiss();
    try {
      await onSubmit(values);
      resetForm();
      setStatus({ sent: true });
    } catch (e) {
      if (isFormError(e)) {
        setErrors(e.errors);
      } else {
        throw e;
      }
      setStatus({ sent: false });
    }
  },
  validate: values => validate(values, contactFormSchema),
  displayName: 'ContactUsForm' // helps with React DevTools
});

export default ContactFormWithFormik(ContactForm);
