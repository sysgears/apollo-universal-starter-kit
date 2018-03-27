import React from 'react';
import { withFormik, FormikProps } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';

import { PostFormProps, Post } from '../types';

const postFormSchema: any = {
  title: [required],
  content: [required]
};

const validate = (values: Post) => validateForm(values, postFormSchema);

const PostForm = ({ values, handleSubmit, submitting }: PostFormProps & FormikProps<Post>) => {
  return (
    <Form name="post" onSubmit={handleSubmit}>
      <Field name="title" component={RenderField} type="text" label="Title" value={values.title} />
      <Field name="content" component={RenderField} type="text" label="Content" value={values.content} />
      <Button color="primary" type="submit" disabled={submitting}>
        Save
      </Button>
    </Form>
  );
};

const PostFormWithFormik = withFormik<PostFormProps, Post>({
  mapPropsToValues: ({ post }) => ({
    title: post && post.title,
    content: post && post.content
  }),
  validate: (values: Post) => validate(values),
  handleSubmit(values: Post, { props: { onSubmit } }: any) {
    onSubmit(values);
  },
  enableReinitialize: true,
  displayName: 'PostForm' // helps with React DevTools
});

export default PostFormWithFormik(PostForm);
