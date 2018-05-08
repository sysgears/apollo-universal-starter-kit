import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import DomainSchema from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik, FieldTypes, FormSchema } from '@domain-schema/formik';

import translate from '../../../i18n';

const postFormSchema = (post, { t, submitting }) =>
  new DomainSchema(
    class extends FormSchema {
      __ = { name: 'post' };
      title = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          label: t('post.field.title')
        },
        defaultValue: post && post.title
      };
      content = {
        type: String,
        fieldType: FieldTypes.input,
        input: {
          label: t('post.field.content')
        },
        defaultValue: post && post.content
      };
      setSubmitBtn() {
        return {
          label: t('post.btn.submit'),
          color: 'primary',
          disabled: submitting
        };
      }
    }
  );

const PostForm = ({ onSubmit, post, ...props }) => {
  const contactForm = new DomainSchemaFormik(postFormSchema(post, props));
  const ContactFormComponent = contactForm.generateForm();

  return <ContactFormComponent onSubmit={onSubmit} />;
};

PostForm.propTypes = {
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  post: PropTypes.object,
  t: PropTypes.func
};

export default translate('post')(PostForm);
