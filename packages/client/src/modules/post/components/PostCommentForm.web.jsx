import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import DomainSchema from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik, FormSchema } from '@domain-schema/formik';

import translate from '../../../i18n';

const commentFormSchema = ({ t, comment }) =>
  new DomainSchema(
    class extends FormSchema {
      __ = { name: 'CommentForm' };
      content = {
        type: String,
        fieldType: DomainSchemaFormik.fields.input,
        input: {
          label: `${t(`comment.label.${comment.id ? 'edit' : 'add'}`)} ${t('comment.label.comment')}`
        },
        defaultValue: comment && comment.content
      };
      setSubmitBtn() {
        return {
          label: t('comment.btn.submit'),
          color: 'primary'
        };
      }
    }
  );

const PostCommentForm = ({ onSubmit, ...props }) => {
  const commentForm = new DomainSchemaFormik(commentFormSchema(props));
  const CommentFormComponent = commentForm.generateForm();

  return <CommentFormComponent onSubmit={onSubmit} />;
};

PostCommentForm.propTypes = {
  comment: PropTypes.object,
  onSubmit: PropTypes.func,
  t: PropTypes.func
};

export default translate('post')(PostCommentForm);
