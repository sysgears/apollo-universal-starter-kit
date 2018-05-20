import React from 'react';
import PropTypes from 'prop-types';
//eslint-disable-next-line import/no-extraneous-dependencies
import { Schema } from '@domain-schema/core';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik } from '@domain-schema/formik';

import translate from '../../../i18n';

const commentFormSchema = (comment, t) =>
  class extends Schema {
    __ = { name: 'comment' };
    content = {
      type: String,
      input: {
        label: `${t(`comment.label.${comment.id ? 'edit' : 'add'}`)} ${t('comment.label.comment')}`
      },
      defaultValue: comment && comment.content
    };
  };

const PostCommentForm = ({ onSubmit, comment, t }) => {
  const commentForm = new DomainSchemaFormik(commentFormSchema(comment, t));
  const CommentFormComponent = commentForm.generateForm({
    label: t('comment.btn.submit'),
    color: 'primary',
    disableOnInvalid: true
  });

  return <CommentFormComponent onSubmit={onSubmit} />;
};

PostCommentForm.propTypes = {
  comment: PropTypes.object,
  onSubmit: PropTypes.func,
  t: PropTypes.func
};

export default translate('post')(PostCommentForm);
