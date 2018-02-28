import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, FormButton } from '../../common/components/native';
import { required, validateForm } from '../../../../../common/validation';

const postFormSchema = {
  title: [required],
  content: [required]
};

const validate = values => validateForm(values, postFormSchema);

const PostForm = ({ values, handleSubmit, setFieldValue, setFieldTouched }) => {
  return (
    <FormView>
      <Field
        name="title"
        component={RenderField}
        type="text"
        label="Title"
        value={values.title}
        onChangeText={text => setFieldValue('title', text)}
        onBlur={() => setFieldTouched('title', true)}
      />
      <Field
        name="content"
        component={RenderField}
        type="text"
        label="Content"
        value={values.content}
        onChangeText={text => setFieldValue('content', text)}
        onBlur={() => setFieldTouched('content', true)}
      />
      <FormButton onPress={handleSubmit}>Save</FormButton>
    </FormView>
  );
};

PostForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  setFieldTouched: PropTypes.func,
  setFieldValue: PropTypes.func,
  values: PropTypes.object
};

const PostFormWithFormik = withFormik({
  mapPropsToValues: props => ({
    title: props.post && props.post.title,
    content: props.post && props.post.content
  }),
  validate: values => validate(values),
  handleSubmit(values, { props: { onSubmit } }) {
    onSubmit(values);
  },
  displayName: 'PostForm' // helps with React DevTools
});

export default PostFormWithFormik(PostForm);
