import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormView, RenderField, FormButton } from '../../common/components/native';
import { required, minLength } from '../../../../common/validation';

const PostCommentForm = ({ handleSubmit, valid, initialValues, onSubmit }) => {
  let operation = 'Add';
  if (initialValues.id !== null) {
    operation = 'Edit';
  }

  return (
    <FormView>
      <Field name="content" component={RenderField} type="text" label="Content" validate={[required, minLength(1)]} />
      <FormButton onPress={handleSubmit(onSubmit)} disabled={!valid}>
        {operation}
      </FormButton>
    </FormView>
  );
};

PostCommentForm.propTypes = {
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool
};

export default reduxForm({
  form: 'comment',
  enableReinitialize: true
})(PostCommentForm);
