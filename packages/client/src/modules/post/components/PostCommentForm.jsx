import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, FormButton } from '../../common/components/native';
import { required, validateForm } from '../../../../../common/validation';

const commentFormSchema = {
  content: [required]
};

const validate = values => validateForm(values, commentFormSchema);

const PostCommentForm = ({ values, handleSubmit, comment, t }) => {
  const operation = t(`comment.label.${comment.id ? 'edit' : 'add'}`);

  return (
    <FormView>
      <Field
        name="content"
        component={RenderField}
        type="text"
        value={values.content}
        placeholder={t('comment.label.field')}
        placeholderTextColor="#8e908c"
      />
      <FormButton onPress={handleSubmit}>{operation}</FormButton>
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
