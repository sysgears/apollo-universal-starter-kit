import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Yup from 'yup';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, FormButton } from '../../common/components/native';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required!'),
  content: Yup.string().required('Content is required!')
});

const PostForm = ({ values, handleSubmit, valid, onSubmit, handleChange }) => {
  return (
    <FormView>
      <Field
        name="title"
        component={RenderField}
        type="text"
        label="Title"
        value={values.title}
        onChange={handleChange}
      />
      <Field
        name="content"
        component={RenderField}
        type="text"
        label="Content"
        value={values.content}
        onChange={handleChange}
      />
      <FormButton onPress={handleSubmit(onSubmit)} disabled={!valid}>
        Save
      </FormButton>
    </FormView>
  );
};

PostForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool,
  values: PropTypes.object,
  handleChange: PropTypes.func
};

const PostFormWithFormik = withFormik({
  mapPropsToValues: props => ({
    title: (props.post && props.post.title) || '',
    content: (props.post && props.post.content) || ''
  }),
  validationSchema: validationSchema,
  handleSubmit(values, { props: { onSubmit } }) {
    onSubmit(values);
  },
  displayName: 'PostForm' // helps with React DevTools
});

export default PostFormWithFormik(PostForm);
