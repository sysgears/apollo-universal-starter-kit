import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, Button, primary } from '../../common/components/native';
import { placeholderColor } from '../../common/components/native/styles';
import { required, validateForm } from '../../../../../common/validation';

const commentFormSchema = {
  content: [required]
};

const validate = values => validateForm(values, commentFormSchema);

const PostCommentForm = ({ values, handleSubmit, comment, t }) => {
  const operation = t(`comment.label.${comment.id ? 'edit' : 'add'}`);

  return (
    <FormView style={{ paddingHorizontal: 15 }}>
      <Field
        name="content"
        component={RenderField}
        type="text"
        value={values.content}
        placeholder={t('comment.label.field')}
        placeholderTextColor={placeholderColor}
      />
      <Button type={primary} onPress={handleSubmit}>
        {operation}
      </Button>
    </FormView>
  );
};

PostCommentForm.propTypes = {
  handleSubmit: PropTypes.func,
  comment: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  t: PropTypes.func
};

const PostCommentFormWithFormik = withFormik({
  mapPropsToValues: props => ({ content: props.comment && props.comment.content }),
  validate: values => validate(values),
  handleSubmit: async (values, { resetForm, props: { onSubmit } }) => {
    await onSubmit(values);
    resetForm({ content: '' });
  },
  displayName: 'CommentForm', // helps with React DevTools
  enableReinitialize: true
});

export default translate('post')(PostCommentFormWithFormik(PostCommentForm));
