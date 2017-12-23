import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form, RenderField, Button } from '../../common/components/web';
import { required } from '../../../../common/validation';

const PostForm = ({ handleSubmit, submitting, onSubmit }) => {
  return (
    <Form name="post" onSubmit={handleSubmit(onSubmit)}>
      <Field name="title" component={RenderField} type="text" label="Title" validate={required} />
      <Field name="content" component={RenderField} type="text" label="Content" validate={required} />
      <Button color="primary" type="submit" disabled={submitting}>
        Save
      </Button>
    </Form>
  );
};

PostForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool
};

export default reduxForm({
  form: 'post',
  enableReinitialize: true
})(PostForm);
