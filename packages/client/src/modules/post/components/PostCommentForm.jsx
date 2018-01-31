import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Field from '../../../utils/FieldAdaptor';
import { FormView, RenderField, FormButton } from '../../common/components/native';

const PostCommentForm = ({ values, handleSubmit, initialValues, handleChange }) => {
  let operation = 'Add';
  if (initialValues.id !== null) {
    operation = 'Edit';
  }

  return (
    <FormView>
      <Field name="content" component={RenderField} type="text" value={values.content} onChange={handleChange} />
      <FormButton onPress={handleSubmit}>{operation}</FormButton>
    </FormView>
  );
};

PostCommentForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object
};

const PostCommentFormWithFormik = withFormik({
  mapPropsToValues: props => ({ content: (props.comment && props.comment.content) || '' }),
  handleSubmit: function(values, { props: { onSubmit } }) {
    onSubmit(values);
  },
  displayName: 'CommentForm ', // helps with React DevTools
  enableReinitialize: true
});

export default PostCommentFormWithFormik(PostCommentForm);
