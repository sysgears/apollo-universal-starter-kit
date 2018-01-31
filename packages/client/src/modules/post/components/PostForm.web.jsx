import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Yup from 'yup';
import Field from '../../../utils/FieldAdaptor';
import { Form, RenderField, Button } from '../../common/components/web';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required!'),
  content: Yup.string().required('Content is required!')
});

const PostForm = ({ values, handleSubmit, submitting, handleChange }) => {
  return (
    <Form name="post" onSubmit={handleSubmit}>
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
      <Button color="primary" type="submit" disabled={submitting}>
        Save
      </Button>
    </Form>
  );
};

PostForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  post: PropTypes.object
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
  enableReinitialize: true,
  displayName: 'PostForm ' // helps with React DevTools
});

export default PostFormWithFormik(PostForm);
