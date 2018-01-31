import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Yup from 'yup';
import Field from './FieldAdaptor';
import { Form, RenderField, Button } from '../../common/components/web';

const PostForm = ({ post, handleSubmit, submitting }) => {
  return (
    <Form name="post" onSubmit={handleSubmit}>
      <Field name="title" component={RenderField} type="text" label="Title" defaultValue={post.title || ''} />
      <Field name="content" component={RenderField} type="text" label="Content" defaultValue={post.content || ''} />
      <Button color="primary" type="submit" disabled={submitting}>
        Save
      </Button>
    </Form>
  );
};

PostForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  post: PropTypes.object
};

const EnhancedForm = withFormik({
  mapPropsToValues: props => ({ comment: props.comment }),
  validationSchema: Yup.object().shape({
    title: Yup.string().required('Title is required!'),
    content: Yup.string().required('Content is required!')
  }),
  handleSubmit(values, { props: { onSubmit } }) {
    onSubmit(values);
  },
  displayName: 'PostForm ' // helps with React DevTools
});

export default EnhancedForm(PostForm);
