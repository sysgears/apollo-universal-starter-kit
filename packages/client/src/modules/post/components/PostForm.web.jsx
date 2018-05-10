import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import { Schema } from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik } from '@domain-schema/formik';

import translate from '../../../i18n';

const postFormSchema = (post, t) =>
  class extends Schema {
    __ = { name: 'post' };
    title = {
      type: String,
      input: {
        label: t('post.field.title')
      },
      defaultValue: post && post.title
    };
    content = {
      type: String,
      input: {
        label: t('post.field.content')
      },
      defaultValue: post && post.content
    };
  };

const PostForm = ({ onSubmit, post, submitting, t }) => {
  const contactForm = new DomainSchemaFormik(postFormSchema(post, t));
  const ContactFormComponent = contactForm.generateForm({
    label: t('post.btn.submit'),
    color: 'primary',
    disabled: submitting
  });

  return <ContactFormComponent onSubmit={onSubmit} />;
};

PostForm.propTypes = {
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  post: PropTypes.object,
  t: PropTypes.func
};

export default translate('post')(PostForm);
