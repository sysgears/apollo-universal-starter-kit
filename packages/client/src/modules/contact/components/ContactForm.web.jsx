import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import { Schema } from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik } from '@domain-schema/formik';

import translate from '../../../i18n';

const contactFormSchema = t =>
  class extends Schema {
    __ = { name: 'ContactForm' };
    name = {
      type: String,
      input: {
        label: t('form.field.name')
      },
      min: 3
    };
    email = {
      type: String,
      input: {
        type: 'email',
        label: t('form.field.email')
      },
      email: true
    };
    content = {
      type: String,
      input: {
        type: 'textarea',
        label: t('form.field.content')
      },
      min: 10
    };
  };

const ContactForm = ({ onSubmit, t }) => {
  const contactForm = new DomainSchemaFormik(contactFormSchema(t));
  const ContactFormComponent = contactForm.generateForm({
    label: t('form.btnSubmit'),
    color: 'primary',
    disableOnInvalid: true
  });

  return <ContactFormComponent onSubmit={async values => await onSubmit(values)} />;
};

ContactForm.propTypes = {
  onSubmit: PropTypes.func,
  t: PropTypes.func
};

export default translate('contact')(ContactForm);
