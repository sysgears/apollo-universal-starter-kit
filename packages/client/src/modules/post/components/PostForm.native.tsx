import React from 'react';
import { withFormik, ComponentDecorator } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, FormButton } from '../../common/components/native';
import { required, validateForm } from '../../../../../common/validation';

import { PostFormProps, Post, PostFormikProps } from '../types';

const postFormSchema: any = {
  title: [required],
  content: [required]
};

const validate = (values: Post) => validateForm(values, postFormSchema);

const PostForm = ({ values, handleSubmit }: PostFormProps) => {
  return (
    <FormView>
      <Field name="title" component={RenderField} type="text" label="Title" value={values.title} />
      <Field name="content" component={RenderField} type="text" label="Content" value={values.content} />
      <FormButton onPress={handleSubmit}>Save</FormButton>
    </FormView>
  );
};

const PostFormWithFormik: ComponentDecorator<PostFormikProps, any> = withFormik({
  mapPropsToValues: ({ post }) => ({
    title: post && post.title,
    content: post && post.content
  }),
  validate: (values: Post) => validate(values),
  handleSubmit(values: Post, { props: { onSubmit } }: any) {
    onSubmit(values);
  },
  displayName: 'PostForm' // helps with React DevTools
});

export default PostFormWithFormik(PostForm);
