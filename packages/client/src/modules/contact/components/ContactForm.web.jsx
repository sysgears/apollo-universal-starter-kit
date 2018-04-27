import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import DomainSchema from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik, FormSchema } from '@domain-schema/formik';

import translate from '../../../i18n';

const contactFormSchema = t =>
  new DomainSchema(
    class extends FormSchema {
      __ = { name: 'ContactForm' };
      name = {
        type: String,
        fieldType: DomainSchemaFormik.fields.input,
        input: {
          label: t('form.field.name')
        },
        min: 3
      };
      email = {
        type: String,
        fieldType: DomainSchemaFormik.fields.input,
        input: {
          type: 'email',
          label: t('form.field.email')
        },
        email: true
      };
      content = {
        type: String,
        fieldType: DomainSchemaFormik.fields.input,
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
    }
  );

const ContactForm = ({ onSubmit, t }) => {
  const contactForm = new DomainSchemaFormik(contactFormSchema(t));
  const ContactFormComponent = contactForm.generateForm();

  return <ContactFormComponent onSubmit={async values => await onSubmit(values)} />;
};

ContactForm.propTypes = {
  onSubmit: PropTypes.func,
  t: PropTypes.func
};

export default translate('contact')(ContactForm);
