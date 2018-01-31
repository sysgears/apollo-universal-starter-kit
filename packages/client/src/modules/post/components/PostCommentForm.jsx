import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Yup from 'yup';
import Field from '../../../utils/FieldAdaptor';
import { FormView, RenderField, FormButton } from '../../common/components/native';

const validationSchema = Yup.object().shape({
  content: Yup.string().required('Comment is required!')
});

const PostCommentForm = ({ handleSubmit, initialValues, onSubmit }) => {
  let operation = 'Add';
  if (initialValues.id !== null) {
    operation = 'Edit';
  }

  return (
    <FormView>
      <Field name="content" component={RenderField} type="text" />
      <FormButton onPress={handleSubmit(onSubmit)}>{operation}</FormButton>
    </FormView>
  );
};

PostCommentForm.propTypes = {
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object
};

const PostCommentFormWithFormik = withFormik({
  mapPropsToValues: props => ({ comment: props.comment }),
  validationSchema: validationSchema,
  handleSubmit(values, { props: { onSubmit } }) {
    onSubmit(values);
  },
  displayName: 'CommentForm ' // helps with React DevTools
});

export default PostCommentFormWithFormik(PostCommentForm);
