import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form, RenderField, Button } from '../../common/components/web';

const required = value => (value ? undefined : 'Required');

const ChatForm = ({ handleSubmit, submitting, onSubmit }) => {
  return (
    <Form name="chat" onSubmit={handleSubmit(onSubmit)}>
      <Field name="title" component={RenderField} type="text" label="Title" validate={required} />
      <Field name="content" component={RenderField} type="text" label="Content" validate={required} />
      <Button color="primary" type="submit" disabled={submitting}>
        Save
      </Button>
    </Form>
  );
};

ChatForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool
};

export default reduxForm({
  form: 'chat',
  enableReinitialize: true
})(ChatForm);
