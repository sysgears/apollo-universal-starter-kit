import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import DomainSchema from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik, FieldTypes, FormSchema } from '@domain-schema/formik';

import translate from '../../../i18n';

const ContactForm = ({ onSubmit, t }) => {
  const contactFormSchema = new DomainSchema(
    class extends FormSchema {
      __ = { name: 'ContactForm' };
      name = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          label: t('form.field.name')
        },
        min: 3
      };
      email = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          type: 'email',
          label: t('form.field.email')
        },
        email: true
      };
      content = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          type: 'textarea',
          label: t('form.field.content')
        },
        min: 10
      };
      setSubmitBtn() {
        return {
          label: t('form.btnSubmit'),
          color: 'primary'
        };
      }
      setBtnsWrapperProps() {
        return {
          className: 'text-center'
        };
      }
    }
  );

  const contactForm = new DomainSchemaFormik(contactFormSchema);
  const ContactFormComponent = contactForm.generateForm(onSubmit);

  return <ContactFormComponent onSubmit={async values => await onSubmit(values)} />;
};

ContactForm.propTypes = {
  onSubmit: PropTypes.func,
  t: PropTypes.func
};

export default translate('contact')(ContactForm);
