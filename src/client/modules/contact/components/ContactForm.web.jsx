import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form, RenderField, Button, Alert } from '../../common/components/web';

const required = value => (value ? undefined : 'Required');

const ContactForm = ({ handleSubmit, submitting, onSubmit, error, sent }) => {
  return (
    <Form name="contact" onSubmit={handleSubmit(onSubmit)}>
      {sent && <Alert color="success">Thank you for contacting us!</Alert>}
      <Field name="name" component={RenderField} type="text" label="Name" validate={required} />
      <Field name="email" component={RenderField} type="text" label="Email" validate={required} />
      <Field name="content" component={RenderField} type="text" label="Content" validate={required} />
      <div className="text-center">
        {error && <Alert color="error">{error}</Alert>}
        <Button color="primary" type="submit" disabled={submitting}>
          Submit
        </Button>
      </div>
    </Form>
  );
};

ContactForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  sent: PropTypes.bool
};

export default reduxForm({
  form: 'contact',
  enableReinitialize: true
})(ContactForm);
