import React from 'react';
import { withFormik, FormikProps } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, FormButton } from '../../common/components/native';
import { required, validateForm } from '../../../../../common/validation';
import { Comment, CommentFormProps } from '../types';

const commentFormSchema: any = {
  content: [required]
};

const validate = (values: Comment) => validateForm(values, commentFormSchema);

const PostCommentForm = ({ values, handleSubmit, comment }: CommentFormProps & FormikProps<Comment>) => {
  let operation = 'Add';
  if (comment.id !== null) {
    operation = 'Edit';
  }

  return (
    <FormView>
      <Field name="content" component={RenderField} type="text" value={values.content} placeholder="Comment" />
      <FormButton onPress={handleSubmit}>{operation}</FormButton>
    </FormView>
  );
};

const PostCommentFormWithFormik = withFormik<CommentFormProps, Comment>({
  mapPropsToValues: ({ comment }) => ({ content: comment && comment.content }),
  validate: (values: Comment) => validate(values),
  handleSubmit: async (values: Comment, { resetForm, props: { onSubmit } }: any) => {
    await onSubmit(values);
    resetForm({ content: '' });
  },
  displayName: 'CommentForm', // helps with React DevTools
  enableReinitialize: true
});

export default PostCommentFormWithFormik(PostCommentForm);
