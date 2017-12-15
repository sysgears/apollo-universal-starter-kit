import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormView, RenderField, FormButton } from '../../common/components/native';
import { required, minLength } from '../../../../common/validation';

const PostForm = ({ handleSubmit, valid, onSubmit }) => {
  return (
    <FormView>
      <Field name="title" component={RenderField} type="text" label="Title" validate={[required, minLength(1)]} />
      <Field name="content" component={RenderField} type="text" label="Content" validate={[required, minLength(1)]} />
      <FormButton onPress={handleSubmit(onSubmit)} disabled={!valid}>
        Save
      </FormButton>
    </FormView>
  );
};

PostForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool
};

export default reduxForm({
  form: 'post',
  enableReinitialize: true
})(PostForm);
