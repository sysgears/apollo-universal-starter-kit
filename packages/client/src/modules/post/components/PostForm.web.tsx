import React from 'react';
import { withFormik, ComponentDecorator } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';

import { PostFormProps, PostValues, PostFormikProps, PostFormSchema } from '../types';

const postFormSchema: PostFormSchema = {
  title: [required],
  content: [required]
};

const validate = (values: PostValues) => validateForm(values, postFormSchema);

const PostForm = ({ values, handleSubmit, submitting }: PostFormProps) => {
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

const PostFormWithFormik: ComponentDecorator<PostFormikProps, any> = withFormik({
  mapPropsToValues: ({ post }) => ({
    title: post && post.title,
    content: post && post.content
  }),
  validate: (values: PostValues) => validate(values),
  handleSubmit(values: PostValues, { props: { onSubmit } }: any) {
    onSubmit(values);
  },
  enableReinitialize: true,
  displayName: 'PostForm' // helps with React DevTools
});

export default PostFormWithFormik(PostForm);
